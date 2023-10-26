// Imports
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useProductsContext } from "./hooks/useProductsContext";
import { useCategoriesContext } from "./hooks/useCategoriesContext";
import { useAuthContext } from "./hooks/useAuthContext";
import { UsersContextProvider } from "./context/UsersContext";
import axios from "axios"

// Pages & Components
import { Dashboard, Login, Signup, Product, AdminDashboard } from "./pages/index";
import { Navbar } from "./components/index";


function App() {
  const { state } = useAuthContext();
  const { dispatch: dispatchProducts } = useProductsContext();
  const { dispatch: dispatchCategories } = useCategoriesContext();

  useEffect(() => {
    const getProducts = async () => {
      const response = await axios.get("/api/products");

      if (response) {
      dispatchProducts({type: "SET_PRODUCTS", payload: response.data});
      }
    }

    const getCategories = async () => {
      const response = await axios.get("/api/categories");
      
      if (response) {
        dispatchCategories({type: "SET_CATEGORIES", payload: response.data})
      }
    }

    getProducts();
    getCategories();
  }, [dispatchProducts, dispatchCategories])

  return (
    <div>
      <BrowserRouter>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/login" element={state.user ? <Dashboard /> : <Login />}/>
          <Route path="/signup" element={state.user ? <Dashboard /> : <Signup />}/>
          <Route path="/product/:id" element={<Product />}/>
          <Route path="/admin" element={<UsersContextProvider><AdminDashboard /></UsersContextProvider>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
