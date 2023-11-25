// Imports
import { createContext, useReducer } from "react";

// TS types
type User = {
  email: string
  _id: string
  createdAt: Date
  role: string
}
type Dispatch = (action: Action) => void
type Action = {
  type: "SET_USERS" | "DELETE_USER",
  payload: User[]
}
type State = {
  users: User[]
}
type UsersProviderProps = {
  children: React.ReactNode
}

export const UsersContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

export const usersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USERS":
      return {
        users: action.payload
      }
    case "DELETE_USER":
      return {
        users: (state.users).filter(item => {
          return action.payload[0]._id !== item._id
        })
      }
    default:
      return state
  }
};

export const UsersContextProvider = ({children}: UsersProviderProps) => {
  const [state, dispatch] = useReducer(usersReducer, {
    users: []
  })

  return (
    <UsersContext.Provider value={{state, dispatch}}>
      {children}
    </UsersContext.Provider>
  )
}