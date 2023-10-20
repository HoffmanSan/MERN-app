import { Link } from "react-router-dom"

// TS types
type ProductsListProps = {
  filteredProducts: {
    _id: number,
    title: string,
    price: number,
    categories: string[],
    description: string,
    inStock: number,
    photoURLS: string[]
  }[]
}
export default function ProductsList({filteredProducts}: ProductsListProps) {
  return (
    <div className="col-span-3 p-5 ml-6 bg-white">
    <h2 className="pb-3 text-2xl font-bold">Wszystkie oferty</h2>
      {filteredProducts.map(product => (
        <Link key={product._id} to={`/product/${product._id}`}>
          <div className="flex my-2 border border-black">
            <div>
              <img src={product.photoURLS[0]} alt={product.title} height="250" width="250"/>
            </div>
            <div>
              <h2>{product.title}</h2>
              <p>{product.price} zł</p>
              <p>{product.description}</p>
              <p>{product.inStock} sztuk na magazynie</p>
              <ul>
                {product.categories.map(category => (
                  <li key={Math.random()}>{category}</li>
                ))}
              </ul>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
