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
  const [newCategory, setNewCategory] = useState({ name: "", imageURL: "", cloudinaryFolderId: nanoid() })
  const [categoryImage, setCategoryImage] = useState<File>()
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  
  // GLOBAL STATES & UTILITIES
  const { categories, dispatchCategories } = useCategoriesContext()
  const { convertImageToBase64String, uploadImage, deleteImages} = useImagesAPI()
  const { createDocument, deleteDocument } = useDataAPI()
  
  // ---- SEARCH BAR LOGIC ---- \\
  const debouncedQuery = useDebounce(query, 500);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) {
      return categories
    }
    return categories.filter(item => 
      item.name.toLowerCase().includes(debouncedQuery.toString().toLowerCase())
    )
  }, [debouncedQuery, categories])

  // ---- FILE INPUT CHANGE ---- \\
  const handleFileChange = (e: ChangeEvent) => {
    let files = (e.target as HTMLInputElement).files

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
    setError("")
    setCategoryImage(files[0])
  }

  // ---- ADD CATEGORY ---- \\
  const addCategory = async () => {
    setError("")
    
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
    setIsAdding(true)

    try {
      const imageString = await convertImageToBase64String(categoryImage)
      const imageURL = await uploadImage(imageString, "categories", newCategory.cloudinaryFolderId)
      newCategory.imageURL = imageURL;
      const response = await createDocument("categories", newCategory)
      dispatchCategories({ type: "CREATE_CATEGORY", payload: [response] })
      setNewCategory({ name: "", imageURL: "", cloudinaryFolderId: nanoid() })
    }
    catch (error: any) {
      setError(error.message)
      console.log(error)
    }
    finally {
      setIsAdding(false)
    }
  }

  // ---- DELETE CATEGORY ---- \\
  const deleteCategory = async (category: Category) => {
    setError("")
    setIsDeleting(category._id)

    try {
      await deleteImages("categories", category.cloudinaryFolderId)
      const response = await deleteDocument("categories", category._id)
      dispatchCategories({ type: "DELETE_CATEGORY", payload: [response.category] })
    }
    catch (error: any) {
      setError(error.message)
      console.log(error)
    }
    finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      <div className="flex justify-center mt-6">
        <input 
          type="file"
          className="text-orange-400"
          onChange={handleFileChange}
        />
        <input
          type="text"
          id="category-add-bar"
          className="w-2/12 p-2 text-center text-black border border-orange-400 rounded-l-md"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />

        <button
          className="p-2 font-bold text-white bg-orange-400 min-w-1/12 hover:bg-orange-600"
          onClick={() => addCategory()}
        >
          {isAdding ? <LoadingSpinner /> : "Dodaj kategorie"}
        </button>
      </div>

      {error && <div className="mx-auto mt-2 error">{error}</div>}

      <div className="flex justify-center m-6">
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
            <td>Obraz</td>
            <td>Opcje</td>
          </tr>
        </thead>
        <tbody>
          {filteredCategories && filteredCategories.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <a href={item.imageURL} className="m-1 !p-1 !rounded-none btn" target="_blank" rel="noreferrer">1</a>
              </td>
              <td>
                <button
                  className="m-1 btn"
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
