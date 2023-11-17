// IMPORTS
import { useEffect } from "react"
import { useDataAPI } from "../../hooks/useDataAPI"
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext"
import { useCartContext } from "../../hooks/useContextHooks/useCartContext"

// COMPONENTS
import { CartCard } from "../../components"

export default function Cart() {
  // LOCAL STATES

  // GLOBAL STATES & CUSTOM HOOKS
  const { getSingleDocument } = useDataAPI()
  const { state: cartState, dispatch } = useCartContext();
  const { state: authState } = useAuthContext();
  const userCartId = authState.user ? authState.user.cartId : ""
  
  // ---- GET CART ITEMS ---- \\
  useEffect(() => {
    const getCart = async () => {
      await getSingleDocument("carts", userCartId)
      .then(response => {
        dispatch({type: "SET_CART_ITEMS", payload: response.cartItems})
      })
      .catch(error => {
        console.log(error)
      })
    }
    
    getCart()
  }, [dispatch, getSingleDocument, userCartId])

  console.log(cartState.cartItems)
  
  return (
    <div className="grid w-9/12 grid-cols-3 gap-4 mx-auto my-6">
      {cartState.cartItems.length !== 0 ? 
        <>
          <div className="col-span-2 p-5 bg-white shadow-md">
            <h2 className="pb-2 border-b border-orange-400">Twój koszyk</h2>
            <div className={`grid grid-rows-${cartState.cartItems.length}`}>
              {cartState.cartItems.map(item => (
                <CartCard key={item.productId} product={item} userCartId={userCartId}/>
              ))}
            </div>
          </div>
            <div className="col-span-1 p-5 bg-white shadow-md pb-7">
              <h2 className="pb-2 border-b border-orange-400">Razem</h2>
              <div className="flex flex-col items-center h-5/6">
              <h2 className="my-auto text-4xl tracking-wider">zł</h2>
              <button className="w-full btn">DOSTAWA I PŁATNOŚĆ</button>
            </div>
          </div>
        </>
      :
        <h3 className="col-span-3 text-center text-gray-400">Ładowanie...</h3>
      }
    </div>
  )
}
