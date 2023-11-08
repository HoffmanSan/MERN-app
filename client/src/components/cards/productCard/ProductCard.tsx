import { Link } from "react-router-dom"

// TS types
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
      <div className="flex flex-col items-center min-h-full m-2 mb-4 transition duration-200 ease-out rounded-md shadow-md group hover:scale-105">
        
        <div className="p-2 bg-gray-100 rounded-md">
          <img
            src={product.photoURLs[0]}
            alt={product.name}
            loading="lazy"
            rel="preload"
            className="object-scale-down h-64 transition duration-200 ease-out "
          />
        </div>

        <div className="px-2 text-center transition duration-200 ease-out ">
          <h2>{product.price} zł</h2>
          <h3 className="text-base">{product.name}</h3>
        </div>

        <div className="mt-auto">
          <small className="text-gray-400">Pozostało {product.inStock} {product.inStock === 1 ? "sztuka" : "sztuk"}</small>
        </div>

      </div>
    </Link>
  )
}
