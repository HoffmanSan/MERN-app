// IMPORTS
import { createContext, useReducer } from "react";

// TYPES
type Category = {
  _id: string
  name: string
  imageURL: string
  cloudinaryFolderId: string
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

export const CategoriesContext = createContext<{categories: Category[]; dispatchCategories: Dispatch} | undefined>(undefined);

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
          return action.payload[0]._id !== item._id
        })
      }
    default:
      return state
  }
};

export const CategoriesContextProvider = ({children}: CategoriesProviderProps) => {
  const [state, dispatchCategories] = useReducer(productsReducer, { categories: [] });

  return (
    <CategoriesContext.Provider value={{...state, dispatchCategories}}>
      {children}
    </CategoriesContext.Provider>
  )
};