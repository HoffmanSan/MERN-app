// Imports
import { useState } from "react";
import { useAuthContext } from "./useContextHooks/useAuthContext";
import axios from "axios";

export const useAuthAPI = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatchAuth } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")

    axios.post(
      `${process.env.REACT_APP_API_SERVER_URI}/api/user-auth/login`,
      { email, password }
    )
    .then(response => {
      localStorage.setItem("user", JSON.stringify(response.data))
      dispatchAuth({ type: "LOGIN", payload: response.data })
    })
    .catch(error => {
      setError(error.response.data.error)
      console.log(error)
    })
    .finally(() => setIsLoading(false))
  }

  const signup = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")

    axios.post(
      `${process.env.REACT_APP_API_SERVER_URI}/api/user-auth/signup`,
      { email, password }
    )
    .then(response => {
      localStorage.setItem("user", JSON.stringify(response.data))
      dispatchAuth({ type: "LOGIN", payload: response.data })
    })
    .catch(error => {
      setError(error.response.data.error)
      console.log(error)
    })
    .finally(() => setIsLoading(false))
  }

  return { login, signup, isLoading, error }
}