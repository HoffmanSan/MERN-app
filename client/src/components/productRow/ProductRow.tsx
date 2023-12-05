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
type User = {
  email: string
  token: string
  role: string
  cartId: string
} | null
type ProductRowProps = {
  product: Product
  user: User
}

export default function ProductRow({product, user}: ProductRowProps) {
  return (
    <div className="grid grid-cols-5 my-2 transition duration-200 ease-out border-t border-gray-300 hover:bg-gray-100 group last:border-b max-mobile:text-center">
                
      <div className="p-2 max-mobile:col-span-5 max-mobile:row-span-2 max-mobile:bg-gray-100">
        <img src={product.photoURLs[0]} alt={product.name} className="object-scale-down w-44 h-44 max-mobile:mx-auto"/>
      </div>

      <div className="flex flex-col col-span-2 py-2 max-mobile:col-span-5 max-mobile:p-0">
        <h4 className="text-lg font-bold group-hover:text-orange-400 max-mobile:text-base">{product.name}</h4>
        <p className="pt-2 text-gray-400 max-mobile:hidden">{product.inStock} {product.inStock === 1 ? "sztuka na magazynie" : "sztuk na magazynie"}</p>
        <p className="py-2 max-mobile:text-sm">{product.description.slice(0, 125)}...</p>
        <ul className="flex mt-auto max-mobile:hidden">
          {product.categories.slice(0, 4).map(category => (
            <li className="px-1" key={category}>{category}{product.categories.indexOf(category) + 1 !== product.categories.length ? "," : ""}</li>
          ))}
          <li className="p-1">{product.categories.length > 4 && `+ ${product.categories.length - 4} inne`}</li>
        </ul>
      </div>

      <div className="flex flex-col col-span-2 p-2 m-3 border-l border-gray-300 max-mobile:col-span-5 max-mobile:border-0 max-mobile:m-0">
        <h3 className="text-2xl text-orange-400 max-mobile:text-lg">{product.price} zł</h3>
        {!user && <p className="text-gray-400">Zaloguj się aby zakupić ten produkt</p>}
        <small className="mt-auto text-center text-gray-400 max-mobile:text-xs">Dodano {new Date(product.createdAt).toLocaleDateString('pl-PL')}</small>
      </div>

    </div>
  )
}
