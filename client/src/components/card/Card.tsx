import { Link } from "react-router-dom"

// TS types
type Product = {
  _id: number
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

export default function Card({product}: CardProps) {
  return (
    <Link to={`/products/${product._id}`}>
      <div className="flex flex-col items-center m-2 transition duration-200 ease-out rounded-md group hover:shadow-md">
        <div className="p-2 bg-gray-100 rounded-md">
          <img src={product.photoURLs[0]} alt={product.name} className="object-scale-down w-64 h-64 transition duration-200 ease-out group-hover:scale-105"/>
        </div>
        <div className="p-2 text-center transition duration-200 ease-out group-hover:scale-110">
          <h2 className="">{product.price} zł</h2>
          <h3 className="text-sm">{product.name}</h3>
          <small className="text-gray-400">Pozostało {product.inStock} {product.inStock === 1 ? "sztuka" : "sztuk"}</small>
        </div>
      </div>
    </Link>
  )
}
