// Imports
import { createContext, useReducer } from "react";

// TS types
type Dispatch = (action: Action) => void
type User = {
  email: string,
  token: string
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

// Create context - define it later in the file
export const AuthContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

export const authReducer = (state: State, action: Action) => {
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
  const [state, dispatch] = useReducer(authReducer, { user: user });

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      { children }
    </AuthContext.Provider>
  )
}