// Imports
import { createContext, useReducer } from "react";

// TS types
type Dispatch = (action: Action) => void
type User = {
  email: string
  token: string
  role: string
  cartId: string
}
type Action = {
  type: "LOGIN" | "LOGOUT"
  payload: User | null
}
type State = {
  user: User | null
}
type AuthProviderProps = {
  children: React.ReactNode
}

// Check local storage for "user" item
const userJson = localStorage.getItem("user");
const user = (userJson !== null) && JSON.parse(userJson)

// Create context
export const AuthContext = createContext<{user: User | null; dispatchAuth: Dispatch} | undefined>(undefined);

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload }
    case "LOGOUT":
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({children}: AuthProviderProps) => {
  const [state, dispatchAuth] = useReducer(authReducer, { user: user });

  return (
    <AuthContext.Provider value={{...state, dispatchAuth}}>
      { children }
    </AuthContext.Provider>
  )
}