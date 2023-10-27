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
  photoCloudinaryId: string
  createdAt: Date
}
type ShowProductsProps = {
  products: Product[],
}

export default function DisplayProductsPanel({products}: ShowProductsProps) {
  const { state: stateAuth } = useAuthContext();
  const { dispatch } = useProductsContext();
  const [isDeleting, setIsDeleting] = useState(0);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

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

  const deleteProduct = async (product: Product) => {
    setIsDeleting(product._id)
    await Promise.all([
      axios.delete(`/api/images/${product.photoCloudinaryId}`),
      axios.delete(`/api/products/${product._id}`, {headers: { 'Authorization': `Bearer ${stateAuth.user?.token}` }})
    ])
    .then(() => {
      setIsDeleting(0);
      dispatch({type: "DELETE_PRODUCT", payload: [product]});
    })
    .catch(error => {
      setIsDeleting(0);
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
            <td>Cena(za szt.)</td>
            <td>Pozostało</td>
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
              <td className="w-2/12">
                {product.categories.map(category => {
                  if (product.categories.indexOf(category)!== product.categories.length - 1) {
                    return `${category}, `
                  }
                    return `${category}`
                })}
              </td>
              <td className="w-3/12">{product.description.slice(0, 75)}{product.description.length >= 75 && "..."}</td>
              <td className="w-2/12">
                {product.photoURLs.map(item => (
                  <a key={item} href={item} target="_blank" rel="noreferrer" className="m-1 btn"><button>{1 + product.photoURLs.indexOf(item)}</button></a>
                ))}
              </td>
              <td>
                <button className="m-1 btn">Edytuj</button>
                <button
                  onClick={() => deleteProduct(product)}
                  disabled={isDeleting !== 0}
                  className="m-1 btn"
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
