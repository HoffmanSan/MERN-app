// Imports
import axios from "axios";
import { useState, useMemo } from "react";
import { useProductsContext } from "../../../hooks/useProductsContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useDebounce } from "../../../hooks/useDebounce";

// Components
import { LoadingSpinner } from "../../index";

// TS types
type Product = {
  _id: number
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  cloudinaryFolderId: string
  createdAt: Date
}
type DisplayProductsProps = {
  changePanel: (v: string) => void
  setUpdatedProduct: (product: Product) => void
}

export default function DisplayProducts({changePanel, setUpdatedProduct}: DisplayProductsProps) {
  // LOCAL STATES
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // GLOBAL STATES
  const { state: stateAuth } = useAuthContext();
  const userAuth = stateAuth.user;
  const { state: stateProducts, dispatch } = useProductsContext();
  const products = stateProducts.products;

  // SEARCH BAR LOGIC
  const debouncedQuery = useDebounce(query, 500)

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) {
      return products
    }
    return products.filter(item => {
      return Object.values(item).some(el => 
        el.toString().toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    })
  }, [debouncedQuery, products]);

  // DELETE PRODUCT
  const deleteProduct = async (product: Product) => {
    setIsDeleting(product._id);
    setError("");

    await Promise.all([
      axios.delete(
        `/api/images/${product.cloudinaryFolderId}`
      ),
      axios.delete(
        `/api/products/${product._id}`,
        { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
      )
    ])
    .then(() => {
      setIsDeleting(null);
      dispatch({type: "DELETE_PRODUCT", payload: [product]});
    })
    .catch(error => {
      setIsDeleting(null);
      setError(error.message);
      console.log(error.message);
    })
  }

  return (
    <>
      <div className="flex justify-center m-6 text-white">
        <input
          type="text"
          id="product-search-bar"
          className="w-3/12 p-2 text-center text-black border border-orange-400 rounded-md"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="mx-auto mb-5 error">{error}</div>}

      <table className="w-11/12 mx-auto border border-orange-400">
        <thead className="text-lg font-bold text-white">
          <tr>
            <td>Nazwa</td>
            <td>Cena</td>
            <td>Pozostało</td>
            <td>Dodano</td>
            <td>Kategorie</td>
            <td>Opis</td>
            <td>Obrazy</td>
            <td>Opcje</td>
          </tr>
        </thead>
        <tbody>
          {filteredProducts && filteredProducts.map(product => (
            <tr key={product._id}>
              <td className="w-2/12">{product.name.slice(0, 50)}{product.name.length >= 50 && "..."}</td>
              <td className="w-1/12">{product.price} zł</td>
              <td className="w-1/12">{product.inStock} szt.</td>
              <td className="w-1/12">{(new Date(product.createdAt)).toLocaleDateString('pl-PL')}</td>
              <td className="w-2/12">
                {product.categories.map(category => {
                  if (product.categories.indexOf(category)!== product.categories.length - 1) {
                    return category + ", "
                  }
                    return category
                })}
              </td>
              <td className="w-3/12">{product.description.slice(0, 75)}{product.description.length >= 75 && "..."}</td>
              <td className="w-2/12">
                {product.photoURLs.map(item => (
                  <a key={item}
                    href={item}
                    target="_blank"
                    rel="noreferrer"
                    className="m-1 !p-1 !rounded-none btn"
                  >
                    <button>{1 + product.photoURLs.indexOf(item)}</button></a>
                ))}
              </td>
              <td>
                <button
                  className="m-1 btn"
                  onClick={() => {
                    setUpdatedProduct(product);
                    changePanel("Edit");
                  }}
                >
                  Edytuj
                </button>
                <button
                  className="m-1 btn"
                  disabled={isDeleting !== null}
                  onClick={() => deleteProduct(product)}
                >
                  {isDeleting === product._id ? <LoadingSpinner /> : "Usuń"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
