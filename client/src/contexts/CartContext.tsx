// IMPORTS
import { createContext, useReducer } from "react";

// TYPES
type CartItem = {
  cartItemId: string
  cartItemQuantity: number
}
type Cart = {
  _id: string
  cartItems: CartItem[]
}
type SetCartAction = {
  type: "SET_CART"
  payload: Cart
}
type UpdateCartAction = {
  type: "ADD_CART_ITEM" | "UPDATE_CART_ITEM" | "DELETE_CART_ITEM"
  payload: CartItem[]
}
type Dispatch = (action: Action) => void
type Action = SetCartAction | UpdateCartAction
type State = {
  cart: Cart
}
type CartProviderProps = {
  children: React.ReactNode
}

export const CartContext = createContext<{cart: Cart; dispatchCart: Dispatch} | undefined>(undefined);

const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        cart: action.payload
      }
    case "ADD_CART_ITEM":
      return {
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.concat(action.payload[0])
        }
      }
    case "UPDATE_CART_ITEM":
      return {
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.map(item => {
            if (item.cartItemId === action.payload[0].cartItemId) {
              return { ...item, cartItemQuantity: action.payload[0].cartItemQuantity}
            }
            return item
          })
        }
      }
    case "DELETE_CART_ITEM":
      return {
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter(item => item.cartItemId !== action.payload[0].cartItemId)
        }
      }
  }
};

export const CartContextProvider = ({children}: CartProviderProps) => {
  const [state, dispatchCart] = useReducer(cartReducer, { cart: { _id: "", cartItems: [] } });

  return (
    <CartContext.Provider value={{...state, dispatchCart}}>
      {children}
    </CartContext.Provider>
  )
};