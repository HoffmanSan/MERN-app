// Imports
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext";

// COMPONENTS
import { ProductRow } from "../index";

// TYPES
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
  // GLOBAL STATES & UTILITIES
  const { user } = useAuthContext();
  
  return (
    <div className="col-span-3 p-5 mb-6 ml-6 bg-white shadow-md h-min max-mobile:col-span-4 max-mobile:mx-0">
      
      {filteredProducts.length > 0 ?
        <>
          <h2 className="pb-3 text-2xl font-bold max-mobile:text-lg max-mobile:text-center max-mobile:pb-0">Wszystkie oferty</h2>
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
