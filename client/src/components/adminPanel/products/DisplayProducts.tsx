// TS types
type Product = {
  _id: number,
  title: string,
  price: number,
  categories: string[],
  description: string,
  inStock: number,
  photoURLS: string[]
}
type ShowProductsProps = {
  products: Product[],
}

export default function DisplayProductsPanel({products}: ShowProductsProps) {

  return (
    <table className="w-11/12 mx-auto">
      <thead className="text-lg font-bold text-white">
        <tr>
          <td>Nazwa</td>
          <td>Cena</td>
          <td>Dostępność</td>
          <td>Kategorie</td>
          <td>Opis</td>
          <td>Opcje</td>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id}>
            <td className="w-3/12">{product.title.slice(0, 50)}{product.title.length >= 50 && "..."}</td>
            <td className="w-1/12">{product.price} zł</td>
            <td className="w-1/12">{product.inStock} szt.</td>
            <td className="w-2/12">
              {product.categories.map(category => {
                if (product.categories.indexOf(category)!== product.categories.length - 1) {
                  return `${category}, `
                }
                  return `${category}`
              })}
            </td>
            <td className="w-3/12">{product.description.slice(0, 75)}{product.description.length >= 75 && "..."}</td>
            <td className="w-2/12">
              <button className="p-2 m-1 text-white bg-orange-400 rounded-md hover:bg-orange-600">Edytuj</button>
              <button className="p-2 m-1 text-white bg-orange-400 rounded-md hover:bg-orange-600">Usuń</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
