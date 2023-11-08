// IMPORTS
import { useState, useEffect } from "react"
import { useDataAPI } from "../../hooks/useDataAPI"
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext"

// COMPONENTS
import { CartCard, LoadingSpinner } from "../../components"

// TYPES
type CartData = {
  productId: string
  productName: string
  productPrice: number
  productInStock: number
  productImageUrl: string
  purchaseQuantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // GLOBAL STATES & UTILITIES
  const { getSingleDocument } = useDataAPI()
  const { state: authState } = useAuthContext();
  const userCartId = authState.user ? authState.user.cartId : ""

  // ---- GET CART DATA ON COMPONENT MOUNT ---- \\
  useEffect(() => {
    const getCartItems = async () => {
      await getSingleDocument("carts", userCartId)
      .then(response => {
        setCartItems(response.cartItems)
      })
      .catch(error => console.log(error))
    }
    getCartItems()
  }, [userCartId])

  return (
    <div className="w-9/12 mx-auto my-6">

      <div className="w-8/12 p-5 bg-white shadow-md">
        <h2 className="pb-2 border-b border-orange-400">Twój koszyk</h2>
        <div className={`grid grid-rows-${cartItems.length}`}>
          {cartItems.map(item => (
            <CartCard key={item.productId} product={item} userCartId={userCartId} isLoading={isLoading} setIsLoading={setIsLoading}/>
          ))}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>

    </div>
  )
}
