// Imports
import { useAuthContext } from "./useContextHooks/useAuthContext";

export const useLogout = () => {
  const { dispatchAuth } = useAuthContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatchAuth({type: "LOGOUT", payload: null})
  }

  return { logout }
}