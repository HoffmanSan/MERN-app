// IMPORTS
import { useState, useEffect, useMemo } from "react"
import { useDataAPI } from "../../hooks/useDataAPI"
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext"
import { useCartContext } from "../../hooks/useContextHooks/useCartContext"
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext"

// COMPONENTS
import { CartCard, LoadingSpinner } from "../../components"

export default function Cart() {
  // LOCAL STATES
  const [isLoading, setIsLoading] = useState(false)

  // GLOBAL STATES & CUSTOM HOOKS
  const { getSingleDocument, updateDocument } = useDataAPI()
  const { state: cartState, dispatch: dispatchCart } = useCartContext();
  const cartId = cartState.cart._id
  const cartItems = cartState.cart.cartItems
  const { state: authState } = useAuthContext();
  const userCartId = authState.user ? authState.user.cartId : ""
  const { state: productsState } = useProductsContext();
  const products = productsState.products

  // ---- GET CART ITEMS ---- \\
  useEffect(() => {
    if (isLoading) {
      return
    }

    const getCart = async () => {
      await getSingleDocument("carts", userCartId)
      .then(response => {
        dispatchCart({type: "SET_CART", payload: response})
      })
      .catch(error => {
        console.log(error)
      })
    }
    
    getCart()
  }, [dispatchCart, getSingleDocument, userCartId, isLoading])

  // ---- UPDATE CART IN DATABASE AFTER LOCAL CART CHANGES ---- \\
  useEffect(() => {
    if (!isLoading) {
      return
    }

    const updateCart = setTimeout(async () => {
      await updateDocument("carts", cartState.cart, userCartId)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(updateCart)
  }, [cartState.cart, isLoading, userCartId, updateDocument])

  // ---- GET TOTAL CART VALUE ---- \\
  const totalCartValue = useMemo(() => {
    let eachCartItemPrice = cartItems.map(item => {
      let product = products.find(product => product._id === item.cartItemId)
      if (product) {
        return product.price
      } else {
        return 0
      } 
    })
    let eachCartItemPriceTimesQuantity = eachCartItemPrice.map((item, index) => item * cartItems[index].cartItemQuantity)
    let entireCartValue = 0

    eachCartItemPriceTimesQuantity.forEach(item => {
      entireCartValue += item
    })
    return entireCartValue
  }, [cartItems, products])
  
  return (
    <div className="grid w-9/12 grid-cols-3 gap-4 mx-auto my-6">

      {/* if the cart is already loaded... */}
      {cartId ?
        <>
          {/* ...and empty */}
          {cartItems.length === 0 && <h3 className="col-span-3 text-center text-gray-400">Twój koszyk jest pusty</h3>}

          {/* ...and contains items */}
          {cartItems.length !== 0 &&
            <>
              <div className="col-span-2 p-5 bg-white shadow-md h-min">
                <h2 className="pb-2 border-b border-orange-400">Twój koszyk</h2>
                <div className={`grid grid-rows-${cartItems.length}`}>
                  {cartItems.map(item => 
                    <CartCard key={item.cartItemId} cartItem={item} setIsLoading={setIsLoading} dispatchCart={dispatchCart}/>
                  )}
                </div>
              </div>

              <div className="col-span-1 p-5 bg-white shadow-md h-min">
                <h2 className="pb-2 border-b border-orange-400">Razem</h2>
                <div className="flex flex-col items-center justify-center">
                  {isLoading ?
                    <LoadingSpinner classNames="!h-20 !w-20 my-10"/>
                  :
                    <>
                      <h2 className="py-10 my-auto text-4xl tracking-wider">{totalCartValue.toFixed(2)} zł</h2>
                      <button className="w-full btn">DOSTAWA I PŁATNOŚĆ</button>
                    </>
                  }
                </div>
              </div>
            </>
          }
        </>
      : 
        // if the cart is not loaded yet
        <h3 className="col-span-3 text-center text-gray-400">Ładowanie...</h3>
      }
      
    </div>
  )
}
