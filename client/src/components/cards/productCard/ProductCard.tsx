// IMPORTS
import { Link } from "react-router-dom";

// TYPES
type Product = {
  _id: string
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  createdAt: Date
}
type CardProps = {
  product: Product
}

export default function ProductCard({product}: CardProps) {
  return (
    <Link to={`/products/${product._id}`} className="mb-4">
      <div className="flex flex-col items-center min-h-full m-2 mb-4 transition duration-200 ease-out border border-gray-100 rounded-md shadow-md group hover:scale-105">
        
        <div className="w-full p-2 bg-gray-100 rounded-md rounded-b-none">
          <img
            src={product.photoURLs[0]}
            alt={product.name}
            loading="lazy"
            rel="preload"
            className="object-scale-down h-56 mx-auto transition duration-200 ease-out max-mobile:h-36 max-tablet:h-44"
          />
        </div>

        <div className="px-2 pt-1 text-center transition duration-200 ease-out ">
          <h2 className="max-mobile:text-sm max-tablet:text-base">{product.price} zł</h2>
          <h3 className="text-base max-tablet:text-sm">{product.name.slice(0, 28)}{product.name.length > 28 && "..."}</h3>
        </div>

        <div className="mt-auto">
          <small className="text-gray-400 max-tablet:text-xs">Dodano {new Date(product.createdAt).toLocaleDateString('pl-PL')}</small>
        </div>

      </div>
    </Link>
  )
}
