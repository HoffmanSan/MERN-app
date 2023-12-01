// IMPORTS
import { useParams } from "react-router-dom"
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext"

// COMPONENTS
import { ProductCard } from "../../components/index"

export default function Search() {

  // GLOBAL STATES & UTILITIES
  const params = useParams() as { querry: string }
  const querry = params.querry
  const { products } = useProductsContext()

  const querryArray = querry.split(" ").filter(element => element.length > 2)

  const querriedProducts = products.filter(item => querryArray.filter(element => item.name.toLowerCase().includes(element.toLowerCase()) || item.description.toLowerCase().includes(element.toLowerCase()) || item.categories.toString().toLowerCase().includes(element.toLowerCase())).length > 0)

  return (
    <div className="grid w-9/12 grid-cols-5 mx-auto bg-white shadow-md">
      {querriedProducts.map(item => (
        <ProductCard key={item._id} product={item}/>
      ))}
    </div>
  )
}
