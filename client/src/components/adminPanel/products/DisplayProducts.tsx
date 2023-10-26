// Imports
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import { useProductsContext } from "../../../hooks/useProductsContext";
import { useDebounce } from "../../../hooks/useDebounce";

// TS types
type Product = {
  _id: number,
  name: string,
  price: number,
  categories: string[],
  description: string,
  inStock: number,
  photoURLs: string[],
  photoCloudinaryId: string
}
type ShowProductsProps = {
  products: Product[],
}

export default function DisplayProductsPanel({products}: ShowProductsProps) {
  const { dispatch } = useProductsContext();
  const [isDeleting, setIsDeleting] = useState(0);
  const [query, setQuery] = useState<string>("");

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
    Promise.all([
      await axios.delete(`/api/images/${product.photoCloudinaryId}`),
      await axios.delete(`/api/products/${product._id}`)
    ])
    .then(() => {
      setIsDeleting(0)
      dispatch({type: "DELETE_PRODUCT", payload: [product]})
    })
    .catch(err => {
      console.log(err)
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
                  <a key={item} href={item} target="_blank" className="p-2 m-1 text-white bg-orange-400 rounded-md hover:bg-orange-600"><button>{1 + product.photoURLs.indexOf(item)}</button></a>
                ))}
              </td>
              <td>
                <button className="p-1 px-2 m-1 text-center text-white bg-orange-400 rounded-md hover:bg-orange-600">Edytuj</button>
                <button
                  onClick={() => deleteProduct(product)}
                  disabled={isDeleting !== 0}
                  className="p-1 px-2 m-1 text-center text-white bg-orange-400 rounded-md hover:bg-orange-600"
                >
                  {isDeleting === product._id ? "..." : "Usuń"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
