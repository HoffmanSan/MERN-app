// Imports
import { useEffect, useState } from "react";
import { useProductsContext } from "../../hooks/useProductsContext";

// Components
import { DisplayProducts, CreateProduct } from "../../components/index";

export default function AdminPanel() {
  const [currentPanel, setCurrentPanel] = useState<string>("Products")
  const { state, dispatch } = useProductsContext();

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();

      if (response.ok) {
      dispatch({type: "SET_PRODUCTS", payload: json});
      }
    }
    
    getProducts()
  }, [dispatch])

  const showCorrectPanel = () => {
    switch (currentPanel) {
      case ("Products"):
        return <DisplayProducts products={state.products}/>
      case ("AddProduct"):
        return <CreateProduct />
      case "Użytkownicy":
        return <div>PANEL UŻYTKOWNIKÓW W PRZYGOTOWANIU</div>
      case "Kategorie":
        return <div>PANEL KATEGORII W PRZYGOTOWANIU</div>
      default:
        return <div>404 ERROR</div>
    }
  }

  return (
    <div className="w-9/12 mx-auto mt-24 bg-white">
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
            className={`p-5 font-bold cursor-pointer hover:bg-orange-600 ${currentPanel === "Kategorie" ? "bg-white text-orange-400 hover:bg-white" : ""}`}
            onClick={() => setCurrentPanel("Kategorie")}
          >
            KATEGORIE
          </li>

        </ul>
      </div>

      {currentPanel === "Products" &&
        <div className="flex w-7/12 m-6 mx-auto text-white">
          <input
            type="text"
            id="product-search-bar"
            className="w-6/12 p-2 text-black border border-orange-400 rounded-l-md"
          />
          <button className="p-3 font-bold bg-orange-400 hover:bg-orange-600">Szukaj</button>
          <button className="ml-auto btn" onClick={() => setCurrentPanel("AddProduct")}>Dodaj produkt</button>
        </div>
      }
      
      {showCorrectPanel()}
      
    </div>
  )
}
