// IMPORTS
import { useState, useEffect } from "react";
import { useUsersContext } from "../../hooks/useContextHooks/useUsersContext";
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext";
import axios from "axios";

// COMPONENTS
import { Products, Categories, Users } from "../../components/index";

export default function AdminPanel() {
  // LOCAL STATES
  const [error, setError] = useState("");
  const [currentPanel, setCurrentPanel] = useState<string>("Products");
  
  // GLOBAL STATES & UTILITIES
  const { dispatchUsers } = useUsersContext();
  const { user } = useAuthContext();
  const userToken = user ? user.token : "";

  // ---- GET USERS FROM DATABASE ---- \\
  useEffect(() => {
    const getUsers = async () => {
      await axios.get(
        `${process.env.REACT_APP_API_SERVER_URI}/api/users`,
        { headers: {'Authorization': `Bearer ${userToken}`} 
      })
      .then((response) => dispatchUsers({ type: "SET_USERS", payload: response.data }))
      .catch(error => setError(error.message));
    };

    getUsers();
  }, [dispatchUsers, userToken]);

  // ---- RENDER CORRECT PANEL ---- \\
  const showCorrectPanel = () => {
    switch (currentPanel) {
      case ("Products"):
        return <Products/>
      case "Users":
        return <Users/>
      case "Categories":
        return <Categories/>
      default:
        return <Products/>
    }
  };

  return (
    <div className="flex flex-col justify-center w-9/12 pb-6 m-6 mx-auto bg-white rounded-md shadow-md max-mobile:w-11/12 max-laptop:w-10/12">
      <div className="text-white bg-orange-400">
        <ul className="flex max-mobile:justify-between">

          <li
            className={`p-5 font-bold max-mobile:text-xs max-tablet:text-sm max-mobile:p-3 cursor-pointer hover:bg-orange-600 ${currentPanel === "Products" || currentPanel === "AddProduct" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Products")}
          >
            PRODUKTY
          </li>

          <li
            className={`p-5 font-bold max-mobile:text-xs max-tablet:text-sm max-mobile:p-3 cursor-pointer hover:bg-orange-600 ${currentPanel === "Users" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Users")}
          >
            UŻYTKOWNICY
          </li>

          <li
            className={`p-5 font-bold max-mobile:text-xs max-tablet:text-sm max-mobile:p-3 cursor-pointer hover:bg-orange-600 ${currentPanel === "Categories" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
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
};
