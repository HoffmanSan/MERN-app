// IMPORTS
import { useMemo, useState } from "react";
import { useCategoriesContext } from "../../../hooks/useCategoriesContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type Category = {
  name: string,
  _id: number
}

export default function DisplayCategories() {
  // LOCAL STATES
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(0);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  
  // GLOBAL STATES
  const { state: authState } = useAuthContext();
  const userAuth = authState.user;
  const { state: categoriesState, dispatch } = useCategoriesContext();
  const categories = categoriesState.categories;
  
  // SEARCH BAR LOGIC
  const debouncedQuery = useDebounce(query, 500);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) {
      return categories
    }
    return categories.filter(item => 
      item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, categories])

  // ADD CATEGORY
  const addCategory = async (newCategory: string) => {
    
    if (!newCategory) {
      setError("Uzupełnij pole nowej kategorii")
      return
    }

    if (categories.filter(item => {
        return Object.values(item).indexOf(newCategory) > -1
      }).length > 0) {
      setError("Ta kategoria już istnieje")
      return
    }
    
    setError("");
    setIsAdding(true);
    
    await axios.post(
      "/api/categories",
      { name: newCategory },
      { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
    )
    .then((response) => {
      setIsAdding(false);
      dispatch({type: "CREATE_CATEGORY", payload: response.data});
      setNewCategory("");
    })
    .catch((error) => {
      setIsAdding(false);
      setError(error.message);
      console.log(error.message);
    })
  };

  // DELETE CATEGORY
  const deleteCategory = async (category: Category) => {
    setIsDeleting(category._id);
    setError("");
    
    await axios.delete(
      `/api/categories/${category._id}`,
      { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
    )
    .then(() => {
      setIsDeleting(0);
      dispatch({type: "DELETE_CATEGORY", payload: [category]});
    })
    .catch((error) => {
      setIsDeleting(0);
      setError(error.message);
      console.log(error.message);
    })
  };

  return (
    <>
      <div className="flex justify-center mt-6">
        <input
          type="text"
          id="category-add-bar"
          className="w-2/12 p-2 text-center text-black border border-orange-400 rounded-l-md"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <button
          className="p-2 font-bold text-white bg-orange-400 min-w-1/12 hover:bg-orange-600"
          onClick={() => addCategory(newCategory)}
        >
          {isAdding ? <LoadingSpinner /> : "Dodaj kategorie"}
        </button>
      </div>

      {error && <div className="mx-auto mt-2 error">{error}</div>}

      <div className="flex justify-center m-6 text-white">
        <input
          type="text"
          id="category-search-bar"
          className="w-3/12 p-2 text-center text-black border border-orange-400 rounded-md"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <table className="w-3/12 mx-auto border border-orange-400">
        <thead className="text-lg font-bold text-white">
          <tr>
            <td>Nazwa</td>
            <td>Opcje</td>
          </tr>
        </thead>
        <tbody>
          {filteredCategories && filteredCategories.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <button
                  className="m-1 btn"
                  disabled={isDeleting !== 0}
                  onClick={() => deleteCategory(item)}
                >
                  {isDeleting === item._id ? <LoadingSpinner /> : "Usuń"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
