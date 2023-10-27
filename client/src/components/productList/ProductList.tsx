// Imports
import { Link } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"

// TS types
type ProductsListProps = {
  filteredProducts: {
    _id: number
    name: string
    price: number
    categories: string[]
    description: string
    inStock: number
    photoURLs: string[]
    createdAt: Date
  }[]
}
export default function ProductsList({filteredProducts}: ProductsListProps) {
  const { state } = useAuthContext();
  
  return (
    <div className="col-span-3 p-5 ml-6 bg-white shadow-md">
      <h2 className="font-bold pb-3text-2xl">Wszystkie oferty</h2>
      {filteredProducts.map(product => (
        <Link key={product._id} to={`/products/${product._id}`}>
          <div className="grid grid-cols-5 my-2 transition duration-200 ease-out border-t border-gray-300 hover:bg-gray-100 last:border-b">
            <div className="p-2">
              <img src={product.photoURLs[0]} alt={product.name} className="object-scale-down w-44 h-44"/>
            </div>
            <div className="flex flex-col col-span-2 py-2">
              <h4 className="text-lg font-bold hover:text-orange-400">{product.name}</h4>
              <p className="pt-2 text-gray-400">{product.inStock} {product.inStock === 1 ? "sztuka na magazynie" : "sztuk na magazynie"}</p>
              <p className="py-2">{product.description.slice(0, 125)}...</p>
              <ul className="flex mt-auto">
                {product.categories.slice(0, 4).map(category => (
                  <li className="px-1" key={category}>{category}{product.categories.indexOf(category) + 1 !== product.categories.length ? "," : ""}</li>
                ))}
                <li className="p-1">{product.categories.length > 4 && `+ ${product.categories.length - 4} inne`}</li>
              </ul>
            </div>
            <div className="flex flex-col col-span-2 p-2 m-3 border-l border-gray-300">
              <h3 className="text-2xl text-orange-400">{product.price} zł</h3>
              {!state.user && <p className="text-gray-400">Zaloguj się aby zakupić ten produkt</p>}
              {state.user && <button disabled={!state.user} className="mt-auto mb-1 btn">Dodaj do koszyka</button>}
              <small className={`text-center text-gray-400 ${!state.user && "mt-auto"}`}>Dodano {new Date(product.createdAt).toLocaleDateString('pl-PL')}</small>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
