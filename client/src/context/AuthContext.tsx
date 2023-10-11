import { createContext, useReducer } from "react";

type Action = {
  type: "LOGIN" | "LOGOUT"
  payload: {
    email: string
    token: string
  } | null
}
type Dispatch = (action: Action) => void
type State = {
  user: {
    email: string
    token: string
  } | null
}
type AuthProviderProps = {children: React.ReactNode}

const userJson = localStorage.getItem("user");
const user = (userJson !== null) ? JSON.parse(userJson) : null;

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