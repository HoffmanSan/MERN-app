// Imports
import { createContext, useReducer } from "react";

// TS Types
type Category = {
  name: string,
  _id: number
}
type Dispatch = (action: Action) => void
type Action = {
  type: "SET_CATEGORIES" | "CREATE_CATEGORY" | "DELETE_CATEGORY",
  payload: Category[]
}
type State = {
  categories: Category[]
}
type CategoriesProviderProps = {
  children: React.ReactNode
}

export const CategoriesContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

export const productsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        categories: action.payload
      }
    case "CREATE_CATEGORY":
      return {
        categories: (state.categories).concat(action.payload)
      }
    case "DELETE_CATEGORY":
      return {
        categories: (state.categories).filter(item => {
          if (action.payload[0]._id !== item._id) {
            return true
          }
            return false
        })
      }
    default:
      return state
  }
};

export const CategoriesContextProvider = ({children}: CategoriesProviderProps) => {
  const [state, dispatch] = useReducer(productsReducer, {
    categories: []
  })

  return (
    <CategoriesContext.Provider value={{state, dispatch}}>
      {children}
    </CategoriesContext.Provider>
  )
}