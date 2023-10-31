// Imports
import { useState, useEffect } from "react";
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios"

// Components
import { Products, Categories, Users } from "../../components/index";

export default function AdminPanel() {
  const [error, setError] = useState("")
  const [currentPanel, setCurrentPanel] = useState<string>("Products")
  const { state: stateAuth } = useAuthContext();
  const { dispatch } = useUsersContext();

  useEffect(() => {
    const getUsers = async () => {
      await axios.get("/api/users", { headers: {'Authorization': `Bearer ${stateAuth.user?.token}`} })
      .then((response) => {
        dispatch({ type: "SET_USERS", payload: response.data })
      })
      .catch(error => {
        setError(error.message)
      })
    }

    getUsers();
  }, [dispatch, stateAuth.user?.token])

  const showCorrectPanel = () => {
    switch (currentPanel) {
      case ("Products"):
        return <Products/>
      case "Users":
        return <Users/>
      case "Categories":
        return <Categories/>
      default:
        return <div>404 Page not found</div>
    }
  }

  return (
    <div className="flex flex-col justify-center w-9/12 pb-6 m-6 mx-auto bg-white rounded-md shadow-md">
      <div className="text-white bg-orange-400">
        <ul className="flex">

          <li
            className={`p-5 font-bold cursor-pointer hover:bg-orange-600 ${currentPanel === "Products" || currentPanel === "AddProduct" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Products")}
          >
            PRODUKTY
          </li>

          <li
            className={`p-5 font-bold cursor-pointer hover:bg-orange-600 ${currentPanel === "Users" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Users")}
          >
            UŻYTKOWNICY
          </li>

          <li
            className={`p-5 font-bold cursor-pointer hover:bg-orange-600 ${currentPanel === "Categories" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Categories")}
          >
            KATEGORIE
          </li>

        </ul>
      </div>

      {!error && showCorrectPanel()}
      {error && <div className="mx-auto mt-5 error">{error}</div>  }
      
    </div>
  )
}
