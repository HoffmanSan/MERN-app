// IMPORTS
import { useAuthContext } from "./useContextHooks/useAuthContext";

export const useLogout = () => {
  // GLOBAL STATES & UTILITIES
  const { dispatchAuth } = useAuthContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatchAuth({type: "LOGOUT", payload: null});
  }

  return { logout };
};