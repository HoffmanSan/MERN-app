// Imports
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProductsContext } from "./hooks/useProductsContext";
import { useCategoriesContext } from "./hooks/useCategoriesContext";
import { useAuthContext } from "./hooks/useAuthContext";
import { UsersContextProvider } from "./context/UsersContext";
import axios from "axios"

// Pages & Components
import { Dashboard, Login, Signup } from "./pages/index";
import { Navbar } from "./components/index";
const Product = lazy(() => import("./pages/product/Products"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

function App() {
  const { state } = useAuthContext();
  const { dispatch: dispatchProducts } = useProductsContext();
  const { dispatch: dispatchCategories } = useCategoriesContext();

  useEffect(() => {
    const getProducts = async () => {
      await axios.get("/api/products")
      .then(response => {
        dispatchProducts({type: "SET_PRODUCTS", payload: response.data})
      })
      .catch(error => {
        console.log(error);
      })
    };

    const getCategories = async () => {
      await axios.get("/api/categories")
      .then(response => {
        dispatchCategories({type: "SET_CATEGORIES", payload: response.data});
      })
      .catch(error => {
        console.log(error);
      })
    };

    getProducts();
    getCategories();
  }, [dispatchProducts, dispatchCategories])

  return (
    <div>
      <BrowserRouter>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/login" element={state.user ? <Navigate to="/"/> : <Login />}/>
          <Route path="/signup" element={state.user ? <Navigate to="/"/> : <Signup />}/>
          <Route path="/products/:id" element={ <Suspense><Product /></Suspense>}/>
          
          <Route path="/admin" element={state.user && state.user.role === "Administrator" ?
            <Suspense>
              <UsersContextProvider>
                  <AdminDashboard />
              </UsersContextProvider>
            </Suspense>
          : 
            <Navigate to="/"/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
