// Imports
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProductsContext } from "./hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "./hooks/useContextHooks/useCategoriesContext";
import { useAuthContext } from "./hooks/useContextHooks/useAuthContext";
import { useDataAPI } from "./hooks/useDataAPI";
import { UsersContextProvider } from "./context/UsersContext";

// Pages & Components
import { Dashboard, Login, Signup } from "./pages/index"
import { Navbar } from "./components/index"
const Cart = lazy(() => import("./pages/cart/Cart"))
const Product = lazy(() => import("./pages/product/Products"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))

function App() {
  const { getData } = useDataAPI();
  const { state } = useAuthContext();
  const user = state.user
  const { dispatch: dispatchProducts } = useProductsContext();
  const { dispatch: dispatchCategories } = useCategoriesContext();

  useEffect(() => {
    getData("products")
    .then(response => dispatchProducts({type: "SET_PRODUCTS", payload: response.data}))
    .catch(error => console.log(error))

    getData("categories")
    .then(response => dispatchCategories({type: "SET_CATEGORIES", payload: response.data}))
    .catch(error => console.log(error))

  }, [dispatchProducts, dispatchCategories])

  return (
    <div>
      <BrowserRouter>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login />}/>
          <Route path="/signup" element={user ? <Navigate to="/"/> : <Signup />}/>

          <Route path="/products/:id" element={
            <Suspense>
              <Product />
            </Suspense>
          }/>

          <Route path="/cart" element={user ?
            <Suspense>
              <Cart />
            </Suspense>
            :
            <Login />
          }/>

          {/* allow only admins to access admin panel */}
          <Route path="/admin" element={user && user.role === "Administrator" ?
            <Suspense>
              <UsersContextProvider>
                <AdminDashboard />
              </UsersContextProvider>
            </Suspense>
            : 
            <Navigate to="/"/>
          }/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
