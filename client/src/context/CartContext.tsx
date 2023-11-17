// Imports
import { createContext, useReducer } from "react";

// TS Types
type CartItem = {
  productId: string
  productName: string
  productPrice: number
  productInStock: number
  productImageUrl: string
  purchaseQuantity: number
}
type Dispatch = (action: Action) => void
type Action = {
  type: "SET_CART_ITEMS" | "ADD_CART_ITEM" | "UPDATE_CART_ITEM" | "DELETE_CART_ITEM"
  payload: CartItem[]
}
type State = {
  cartItems: CartItem[]
}
type CartProviderProps = {
  children: React.ReactNode
}

export const CartContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CART_ITEMS":
      return {
        cartItems: action.payload
      }
    case "ADD_CART_ITEM":
      return {
        cartItems: [...state.cartItems, action.payload[0]]
      }
    case "UPDATE_CART_ITEM":
      return {
        cartItems: state.cartItems.map(item => {
          if (item.productId === action.payload[0].productId) {
            return action.payload[0]
          }
            return item
        })
      }
    case "DELETE_CART_ITEM":
      return {
        cartItems: state.cartItems.filter(item => item.productId !== action.payload[0].productId)
      }
  }
}

export const CartContextProvider = ({children}: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] })

  return (
    <CartContext.Provider value={{state, dispatch}}>
      {children}
    </CartContext.Provider>
  )
}