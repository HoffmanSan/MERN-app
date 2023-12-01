// Imports
import { Link } from "react-router-dom"
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext"

// COMPONENTS
import { ProductRow } from "../index"

// TS types
type ProductsListProps = {
  filteredProducts: {
    _id: string
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
  const { user } = useAuthContext()
  
  return (
    <div className="col-span-3 p-5 ml-6 bg-white shadow-md h-min">
      
      {filteredProducts.length > 0 ?
        <>
          <h2 className="font-bold pb-3text-2xl">Wszystkie oferty</h2>
          {filteredProducts.map(product => (
            <Link key={product._id} to={`/products/${product._id}`}>
              <ProductRow product={product} user={user}/>
            </Link>
          ))}
        </>
      :
        <h3 className="col-span-4 text-center text-gray-400">Brak produktów spełniających podane kryteria</h3>
      }
    </div>
  )
}
