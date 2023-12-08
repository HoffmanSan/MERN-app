// IMPORTS
import { ChangeEvent, useMemo, useState } from "react";
import { useCategoriesContext } from "../../../hooks/useContextHooks/useCategoriesContext";
import { useDataAPI } from "../../../hooks/useDataAPI";
import { useImagesAPI } from "../../../hooks/useImagesAPI";
import { useDebounce } from "../../../hooks/useDebounce";
import { nanoid } from "nanoid";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type Category = {
  _id: string
  name: string
  cloudinaryFolderId: string
}

export default function DisplayCategories() {
  // LOCAL STATES
  const [newCategory, setNewCategory] = useState({ 
    name: "",
    imageURL: "",
    cloudinaryFolderId: nanoid()
  });
  const [categoryImage, setCategoryImage] = useState<File>();
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  
  // GLOBAL STATES & UTILITIES
  const { categories, dispatchCategories } = useCategoriesContext();
  const { convertImageToBase64String, uploadImage, deleteImages} = useImagesAPI();
  const { createDocument, deleteDocument } = useDataAPI();
  
  // ---- SEARCH BAR LOGIC ---- \\
  const debouncedQuery = useDebounce(query, 500);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) {
      return categories
    }
    return categories.filter(item => 
      item.name.toLowerCase().includes(debouncedQuery.toString().toLowerCase())
    );
  }, [debouncedQuery, categories]);

  // ---- FILE INPUT CHANGE ---- \\
  const handleFileChange = (e: ChangeEvent) => {
    let files = (e.target as HTMLInputElement).files;

    // validation
    if (!files || files.length === 0) {
      return 
    }
    if (!files[0].type.includes("image")) {
      setError("Plik musi być obrazem")
      return
    }
    if (files[0].size > 2500000) {
      setError("Obraz nie może być większy niż 2.5 mb")
      return
    }

    // accept file if validation passed
    setError("");
    setCategoryImage(files[0]);
  }

  // ---- ADD CATEGORY ---- \\
  const addCategory = async () => {
    setError("");
    
    // validation
    if (!newCategory.name) {
      setError("Uzupełnij pole nowej kategorii")
      return
    }
    if (!categoryImage) {
      setError("Dodaj obraz reprezentujący kategorię")
      return
    }
    if (categories.filter(item => {
        return Object.values(item)[1].toString().toLowerCase().indexOf(newCategory.name.toLowerCase()) > -1
      }).length > 0) {
      setError("Ta kategoria już istnieje")
      return
    }
    
    // start process if validation is passed
    setIsAdding(true);

    try {
      const imageString = await convertImageToBase64String(categoryImage);
      const imageURL = await uploadImage(imageString, "categories", newCategory.cloudinaryFolderId);
      newCategory.imageURL = imageURL;
      const response = await createDocument("categories", newCategory);
      dispatchCategories({ type: "CREATE_CATEGORY", payload: [response] });
      setNewCategory({ name: "", imageURL: "", cloudinaryFolderId: nanoid() });
    }
    catch (error: any) {
      setError(error.message);
      console.log(error);
    }
    finally {
      setIsAdding(false);
    }
  }

  // ---- DELETE CATEGORY ---- \\
  const deleteCategory = async (category: Category) => {
    setError("");
    setIsDeleting(category._id);

    try {
      await deleteImages("categories", category.cloudinaryFolderId);
      const response = await deleteDocument("categories", category._id);
      dispatchCategories({ type: "DELETE_CATEGORY", payload: [response.category] });
    }
    catch (error: any) {
      setError(error.message);
      console.log(error);
    }
    finally {
      setIsDeleting(null);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-5 mt-6 border-b border-orange-400">

        <h3 className="w-full p-1 mb-3 text-center text-white bg-orange-400 max-tablet:text-base">Nowa kategoria</h3>

        {/* category img input */}
        <input 
          type="file"
          className="text-orange-400 max-mobile:text-transparent max-mobile:w-4/12 max-mobile:pb-2 max-mobile:scale-90 max-tablet:scale-95"
          onChange={handleFileChange}
        />

        {/* category name input */}
          <input
            type="text"
            id="category-add-bar"
            className="w-3/12 p-2 my-3 text-center text-black border border-orange-400 rounded-md max-tablet:text-sm max-mobile:w-9/12 max-tablet:w-6/12"
            placeholder="Nowa kategoria..."
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />

          <button
            className="w-3/12 p-2 font-bold text-white bg-orange-400 border border-orange-400 hover:bg-orange-600 max-tablet:text-sm max-mobile:w-6/12"
            onClick={() => addCategory()}
          >
            {isAdding ? <LoadingSpinner /> : "Dodaj kategorie"}
          </button>

      </div>

      {error && <div className="mx-auto mt-2 error max-tablet:text-sm">{error}</div>}

      <div className="flex justify-center m-6">

        {/* search bar */}
        <input
          type="text"
          id="category-search-bar"
          className="w-3/12 p-2 text-center text-black border border-orange-400 rounded-md max-mobile:w-11/12 max-tablet:text-sm max-tablet:w-6/12"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      </div>
      
      <table className="w-3/12 mx-auto border border-orange-400 max-mobile:w-11/12 max-tablet:text-sm max-tablet:w-7/12 max-laptop:w-5/12">

        {/* category table */}
        <thead className="text-lg font-bold text-white max-tablet:text-sm">
          <tr>
            <td>Nazwa</td>
            <td>Obraz</td>
            <td>Opcje</td>
          </tr>
        </thead>

        <tbody>
          {filteredCategories && filteredCategories.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <a
                  href={item.imageURL}
                  className="m-1 !p-1 !rounded-none btn max-tablet:text-xs"
                  target="_blank"
                  rel="noreferrer"
                >
                  1
                </a>
              </td>
              <td>
                <button
                  className="m-1 btn max-tablet:text-xs"
                  disabled={isDeleting !== null}
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
