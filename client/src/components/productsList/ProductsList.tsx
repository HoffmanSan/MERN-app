
// TS types
type Product = {
  _id: number,
  title: string,
  price: number,
  categories: string[]
}

type ProductsListProps = {
  filteredProducts: Product[]
}
export default function ProductsList({filteredProducts}: ProductsListProps) {
  return (
    <div className="col-span-3 p-5 ml-6 bg-white">
    <h2 className="pb-3 text-2xl font-bold">Wszystkie oferty</h2>
      {filteredProducts.map(product => (
        <div key={product._id} className="my-2 border border-black">
          <h2>{product.title}</h2>
          <p>{product.price} zł</p>
          <ul>
            {product.categories.map(category => (
              <li key={Math.random()}>{category}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
