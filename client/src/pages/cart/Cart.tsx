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

  const entireCartCost = cartItems.map(item => {
    return item.purchaseQuantity * item.productPrice
  })

  const getCartValue = () => {
    let cartItemsCost = cartItems.map(item => {
      return item.purchaseQuantity * item.productPrice
    })

    let sum = 0;

    for (let i = 0; i < cartItemsCost.length; i++ ) {
      sum += cartItemsCost[i];
    }

    return sum
  }

  // ---- GET CART DATA ON COMPONENT MOUNT ---- \\
  useEffect(() => {
    const getCartItems = async () => {
      await getSingleDocument("carts", userCartId)
      .then(response => {
        setCartItems(response.cartItems)
        console.log("rendered")
      })
      .catch(error => console.log(error))
    }
    getCartItems()
  }, [userCartId])

  return (
    <div className="grid w-9/12 grid-cols-3 gap-4 mx-auto my-6">

      <div className="col-span-2 p-5 bg-white shadow-md">
        <h2 className="pb-2 border-b border-orange-400">Twój koszyk</h2>
        <div className={`grid grid-rows-${cartItems.length}`}>
          {cartItems.map(item => (
            <CartCard key={item.productId} product={item} userCartId={userCartId} isLoading={isLoading} setIsLoading={setIsLoading}/>
          ))}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
      <div className="col-span-1 p-5 bg-white shadow-md">
        <h2 className="pb-2 border-b border-orange-400">Razem</h2>
        <div className="flex items-center justify-center">
          <h2 className="tracking-wide">{getCartValue()} zł</h2>
          <button>DOSTAWA</button>
        </div>
      </div>

    </div>
  )
}
