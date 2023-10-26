// Imports
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";

type Product = {
  _id: number,
  name: string,
  price: number,
  categories: string[],
  description: string,
  inStock: number,
  photoURL: string
}

export default function Products() {
  const [productQuantity, setProductQuantity] = useState(1)
  const [product, setProduct] = useState<Product>()
  const {id} = useParams();

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetch(`/api/products/${id}`);
      const product = await response.json();
      setProduct(product)
    }

    getProduct()
  }, [id])
  
  return (
    <div className="grid w-7/12 grid-cols-5 gap-5 mx-auto mt-6">
      {product && (
      <>
        <div className="col-span-3 bg-blue-700">
          <h3>{product.name}</h3>
          <img src={product.photoURL} alt={`${product.name}`} />
        </div>
        <div className="col-span-2 bg-red-700">
          <h3>{product.name}</h3>
          <h4>{product.price}</h4>
          <button className="bg-gray-500 h-7 w-7" onClick={() => setProductQuantity(productQuantity - 1)}>-</button>
          <button className="bg-gray-500 h-7 w-7" onClick={() => setProductQuantity(productQuantity + 1)}>+</button>
        </div>
      </>
      )}
    </div>
  )
}
