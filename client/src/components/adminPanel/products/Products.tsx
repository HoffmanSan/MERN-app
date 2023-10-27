// Imports
import { useState } from "react";

// Components
import { DisplayProducts, CreateProduct } from "../.."

// TS types
type Product = {
  _id: number
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  photoCloudinaryId: string
  createdAt: Date
}
type ProductsProps = {
  products: Product[]
}

export default function Products({products} : ProductsProps) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <button
        onClick={() => {setShowPanel(!showPanel)}}
        className="w-3/12 mx-auto mt-6 btn"
      >
        {!showPanel ? "Dodaj produkt" : "Pokaż produkty"}
      </button>

      {showPanel === false && <DisplayProducts products={products}/>}
      {showPanel === true && <CreateProduct />}
    </>
  )
}
