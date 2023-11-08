// IMPORTS
import { useState, useEffect } from "react"
import { useDataAPI } from "../../../hooks/useDataAPI"

// TYPES
type CartCardProps = {
  product: {
    productId: string
    productName: string
    productPrice: number
    productInStock: number
    productImageUrl: string
    purchaseQuantity: number
  }
  userCartId: string
  isLoading: boolean
  setIsLoading: (v: boolean) => void
}
export default function CartCard({product, userCartId, isLoading, setIsLoading}: CartCardProps) {
  const [purchaseQuantity, setPurchaseQuantity] = useState(product.purchaseQuantity)
  const { updateDocument } = useDataAPI();

  useEffect(() => {
    // run the code below only when user changes cart data
    if (!isLoading) {
      return
    }

    // update cart items
    const changeCartItem = async () => {
      await updateDocument("carts", { ...product, purchaseQuantity: purchaseQuantity}, userCartId)
    }

    // http requests debouncing
    const timeout = setTimeout(async () => {
      await changeCartItem()
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
    
  }, [updateDocument, setIsLoading, purchaseQuantity, product, isLoading, userCartId])
  

  return (
    <div className="grid grid-cols-6 border-b-2 border-orange-400">

      <div className="grid grid-cols-3 col-span-3 py-2">
        <img src={product.productImageUrl} alt={product.productName} className="object-scale-down object-center w-24 h-24 mx-auto bg-gray-200"/>
        <h3 className="col-span-2 my-auto ml-2 text-center">{product.productName}</h3>
      </div>

      <div className="grid grid-cols-3 col-span-3 py-2">
        
        <div className="flex items-center justify-center col-span-2">
          <button
            className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === 1 && "bg-orange-200"}`}
            onClick={() => {
              setIsLoading(true)
              setPurchaseQuantity(purchaseQuantity - 1)
            }}
            disabled={purchaseQuantity === 1}
          >
            -
          </button>

          <input
            type="number"
            className="w-4/12 h-10 font-bold text-center border-orange-400 border-y-2"
            value={purchaseQuantity}
            readOnly
          />

          <button
            className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === product.productInStock && "bg-orange-200"}`}
            onClick={() => {
              setIsLoading(true)
              setPurchaseQuantity(purchaseQuantity + 1)
            }}
            disabled={purchaseQuantity === product.productInStock}
          >
            +
          </button>
        </div>

        <div className="flex flex-col items-end justify-center mr-3">
          <h3 className="tracking-wide">{(product.productPrice * purchaseQuantity).toFixed(2)} zł</h3>
          <small className="text-gray-400">za sztukę {product.productPrice.toFixed(2)} zł</small>
        </div>

      </div>
    </div>
  )
}
