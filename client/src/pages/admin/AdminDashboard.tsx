// Imports
import { useState, useEffect } from "react";
import { useProductsContext } from "../../hooks/useProductsContext";
import { useCategoriesContext } from "../../hooks/useCategoriesContext";
import { useUsersContext } from "../../hooks/useUsersContext";
import axios from "axios"

// Components
import { Products, Categories, Users } from "../../components/index";

export default function AdminPanel() {
  const [currentPanel, setCurrentPanel] = useState<string>("Products")
  const {state: stateUsers, dispatch } = useUsersContext();
  const { state: stateProducts } = useProductsContext();
  const { state: stateCategories } = useCategoriesContext();

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get("/api/users");

      if (response) {
        dispatch({type: "SET_USERS", payload: response.data})
      }
    }

    getUsers();
  }, [])

  const showCorrectPanel = () => {
    switch (currentPanel) {
      case ("Products"):
        return <Products products={stateProducts.products}/>
      case "Użytkownicy":
        return <Users users={stateUsers.users}/>
      case "Categories":
        return <Categories categories={stateCategories.categories}/>
      default:
        return <div>404 ERROR</div>
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
            className={`p-5 font-bold cursor-pointer hover:bg-orange-600 ${currentPanel === "Użytkownicy" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Użytkownicy")}
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

      {showCorrectPanel()}
      
    </div>
  )
}