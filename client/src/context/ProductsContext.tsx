// Imports
import { createContext, useReducer } from "react";

// TS types
type Product = {
  _id: number
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  cloudinaryFolderId: string
  createdAt: Date
}
type Dispatch = (action: Action) => void
type Action = {
  type: "SET_PRODUCTS" | "CREATE_PRODUCT" | "DELETE_PRODUCT" | "UPDATE_PRODUCT",
  payload: Product[]
}
type State = {
  products: Product[]
}
type ProductsProviderProps = {
  children: React.ReactNode
}

export const ProductsContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

export const productsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        products: action.payload
      }
    case "CREATE_PRODUCT":
      return {
        products: (state.products).concat(action.payload)
      }
    case "DELETE_PRODUCT":
      return {
        products: (state.products).filter(item => {
          return action.payload[0]._id !== item._id
        })
      }
      case "UPDATE_PRODUCT":
        return {
          products: (state.products).map(item => {
            if (action.payload[0]._id === item._id) {
              return action.payload[0]
            }
              return item
          })
        }
    default:
      return state
  }
}

export const ProductsContextProvider = ({children}: ProductsProviderProps) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: []
  })

  return (
    <ProductsContext.Provider value={{state, dispatch}}>
      {children}
    </ProductsContext.Provider>
  )
}
