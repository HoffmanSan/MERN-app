// Imports
import { useMemo, useState } from "react";
import axios from "axios";
import { useCategoriesContext } from "../../../hooks/useCategoriesContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAuthContext } from "../../../hooks/useAuthContext";

// Components
import { LoadingSpinner } from "../../index";

// TS types
type Category = {
  name: string,
  _id: number
}
type DisplayCategoriesProps = {
  categories: Category[]
}

export default function DisplayCategories({categories}: DisplayCategoriesProps) {
  const { state: stateAuth } = useAuthContext();
  const { dispatch } = useCategoriesContext();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(0);
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const filteredCategories = useMemo(() => { return categories.filter(item => 
    item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  )}, [debouncedQuery, categories])

  const addCategory = async (newCategory: string) => {
    if (!newCategory) {
      setError("Uzupełnij pole nowej kategorii")
      return
    }

    // check if category already exists
    if (categories.filter(item => { return Object.values(item).indexOf(newCategory) > -1 }).length > 0) {
      setError("Ta kategoria już istnieje")
      return
    }
    
    setError("")
    setLoading(true)
    
    await axios.post("/api/categories", { name: newCategory }, {headers: { 'Authorization': `Bearer ${stateAuth.user?.token}` }})
      .then((response) => {
        setLoading(false);
        dispatch({type: "CREATE_CATEGORY", payload: response.data})
        setNewCategory("")
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
        setError(error.message);
      })
  }

  const deleteCategory = async (category: Category) => {
    setIsDeleting(category._id)
    setError("")
    
    await axios.delete(`/api/categories/${category._id}`, {headers: { 'Authorization': `Bearer ${stateAuth.user?.token}` }})
      .then(() => {
        dispatch({type: "DELETE_CATEGORY", payload: [category]})
        setIsDeleting(0)
      })
      .catch((err) => {
        setIsDeleting(0)
        setError(err.message)
      })
  }

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
          {loading ? <LoadingSpinner /> : "Dodaj kategorie"}
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
                  disabled={isDeleting !== 0}
                  className="m-1 btn"
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
