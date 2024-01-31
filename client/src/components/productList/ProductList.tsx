// Imports
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext";

// COMPONENTS
import { ProductRow } from "../index";

// TYPES
import { Product } from "../../types/types"
type ProductsListProps = {
  filteredProducts: Product[]
}

export default function ProductsList({filteredProducts}: ProductsListProps) {
  // GLOBAL STATES & UTILITIES
  const { user } = useAuthContext();
  
  return (
    <div className="col-span-3 p-5 mb-6 ml-6 bg-white shadow-md h-min max-tablet:col-span-4 max-tablet:mx-0">
      
      {filteredProducts.length > 0 ?
        <>
          <h2 className="pb-3 text-2xl font-bold max-tablet:text-lg max-tablet:text-center max-mobile:pb-0">Wszystkie oferty</h2>
          {filteredProducts.map(product => (
            <Link key={product._id} to={`/products/${product._id}`}>
              <ProductRow product={product}/>
            </Link>
          ))}
        </>
      :
        <h3 className="col-span-4 text-center text-gray-400">Brak produktów spełniających podane kryteria</h3>
      }
      
    </div>
  )
}
