// IMPORTS
import { useMemo, useState } from "react"
import { useProductsContext } from "../../../hooks/useContextHooks/useProductsContext"

// TYPES
type UpdateCartAction = {
  type: "UPDATE_CART_ITEM" | "DELETE_CART_ITEM"
  payload: CartItem[]
}
type Action = UpdateCartAction
type Dispatch= (action: Action) => void
type CartItem = {
  cartItemId: string
  cartItemQuantity: number
}
type CartCardProps = {
  cartItem: CartItem
  dispatchCart: Dispatch
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CartCard({cartItem, setIsLoading, dispatchCart}: CartCardProps) {
  // LOCAL STATES
  const [purchaseQuantity, setPurchaseQuantity] = useState(cartItem.cartItemQuantity)
  const [isDeleting] = useState(false)

  // GLOBAL STATES & CUSTOM HOOKS
  const { products } = useProductsContext()
  
  // ---- FIND PRODUCT IN PRODUCTS CONTEXT ON MOUNT ---- \\
  const product = useMemo(() => {
    return products.find(item => item._id === cartItem.cartItemId)
  }, [cartItem.cartItemId, products])

  const deleteProductFromCart = () => {
    dispatchCart({type: "DELETE_CART_ITEM", payload: [{ cartItemId: cartItem.cartItemId, cartItemQuantity: purchaseQuantity }]})
  }

  // ---- IF CART ITEM HAS BEEN REMOVED FROM THE DATABASE ---- \\
  if (!product) {
    return null
  }

  return (
    <div className={`grid grid-cols-6 border-b border-orange-400 ${isDeleting && "hidden"}`}>

      <div className="grid grid-cols-3 col-span-3 py-2">
        <img src={product.photoURLs[0]} alt={product.name} className="object-scale-down object-center w-24 h-24 mx-auto bg-gray-200"/>
        <a href={`/products/${product._id}`}className="col-span-2 my-auto ml-2 text-center uppercase hover:text-orange-400">{product.name}</a>
      </div>

      <div className="grid grid-cols-5 col-span-3 py-2">
        
        <div className="flex items-center justify-center col-span-2">
          <button
            className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === 1 && "bg-orange-200"}`}
            onClick={() => {
              setIsLoading(true)
              setPurchaseQuantity(currValue => currValue - 1)
              dispatchCart({type: "UPDATE_CART_ITEM", payload: [{ cartItemId: cartItem.cartItemId, cartItemQuantity: purchaseQuantity - 1 }]})
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
            className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === product.inStock && "bg-orange-200"}`}
            onClick={() => {
              setIsLoading(true)
              setPurchaseQuantity(currValue => currValue + 1)
              dispatchCart({type: "UPDATE_CART_ITEM", payload: [{ cartItemId: cartItem.cartItemId, cartItemQuantity: purchaseQuantity + 1 }]})
            }}
            disabled={purchaseQuantity === product.inStock}
          >
            +
          </button>
          
        </div>

        <div className="flex items-center justify-center">
          <svg 
            className="hover:cursor-pointer"
            onClick={() => {
              setIsLoading(true)
              deleteProductFromCart()
            }}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            fill="#EA580C"
            width="35"
            height="35"
            viewBox="0 0 48 48"
          >
            <path d="M 20 2 C 18.35503 2 17 3.3550302 17 5 L 17 7 L 4 7 A 1.0001 1.0001 0 1 0 4 9 L 18 9 A 1.0001 1.0001 0 0 0 19 8 L 19 5 C 19 4.4349698 19.43497 4 20 4 L 28 4 C 28.56503 4 29 4.4349698 29 5 L 29 8 A 1.0001 1.0001 0 0 0 30 9 L 44 9 A 1.0001 1.0001 0 1 0 44 7 L 31 7 L 31 5 C 31 3.3550302 29.64497 2 28 2 L 20 2 z M 6.9863281 10.986328 A 1.0001 1.0001 0 0 0 6 12.09375 L 8.6640625 40.466797 C 8.9044953 43.026846 11.070395 45 13.642578 45 L 24 45 L 34.357422 45 C 36.928851 45 39.095475 43.027166 39.335938 40.466797 L 42 12.09375 A 1.000496 1.000496 0 0 0 40.007812 11.90625 L 37.345703 40.28125 C 37.200166 41.830881 35.913993 43 34.357422 43 L 24 43 L 13.642578 43 C 12.084761 43 10.799864 41.831201 10.654297 40.28125 L 7.9921875 11.90625 A 1.0001 1.0001 0 0 0 6.9863281 10.986328 z M 14.646484 13.986328 A 1.0001 1.0001 0 0 0 13.626953 15.0625 L 15.001953 37.0625 A 1.0001 1.0001 0 1 0 16.998047 36.9375 L 15.623047 14.9375 A 1.0001 1.0001 0 0 0 14.646484 13.986328 z M 23.984375 13.986328 A 1.0001 1.0001 0 0 0 23 15 L 23 37 A 1.0001 1.0001 0 1 0 25 37 L 25 15 A 1.0001 1.0001 0 0 0 23.984375 13.986328 z M 33.324219 13.986328 A 1.0001 1.0001 0 0 0 32.376953 14.9375 L 31.001953 36.9375 A 1.0001 1.0001 0 1 0 32.998047 37.0625 L 34.373047 15.0625 A 1.0001 1.0001 0 0 0 33.324219 13.986328 z"></path>
          </svg>
        </div>

        <div className="flex flex-col items-end justify-center col-span-2 mr-3">
          <h3 className="tracking-wide">{(product.price * purchaseQuantity).toFixed(2)} zł</h3>
          {purchaseQuantity !== 1 && <small className="text-gray-400">{product.price} zł za sztukę</small>}
        </div>

      </div>
    </div>
  )
}
