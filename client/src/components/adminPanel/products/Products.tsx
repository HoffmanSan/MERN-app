// IMPORTS
import { useState } from "react";

// COMPONENTS
import { DisplayProducts, CreateProduct, UpdateProduct } from "../.."

// TYPES
type Product = {
  _id: string
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  cloudinaryFolderId: string
  createdAt: Date
}

export default function Products() {
  // LOCAL STATES
  const [showPanel, setShowPanel] = useState("Display");
  const [updatedProduct, setUpdatedProduct] = useState<Product>();

  return (
    <>
      <button
        className="w-3/12 mx-auto mt-6 btn"
        onClick={() => setShowPanel(showPanel === "Display" ? "Create" : "Display")}
      >
        {showPanel === "Display" ? "Dodaj produkt" : "Pokaż produkty"}
      </button>

      {showPanel === "Display" && <DisplayProducts changePanel={setShowPanel} setUpdatedProduct={setUpdatedProduct}/>}
      {showPanel === "Create" && <CreateProduct />}
      {showPanel === "Edit" && updatedProduct && <UpdateProduct updatedProduct={updatedProduct}/>}
    </>
  )
}
