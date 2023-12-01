// Imports
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProductsContext } from "./hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "./hooks/useContextHooks/useCategoriesContext";
import { useAuthContext } from "./hooks/useContextHooks/useAuthContext";
import { useDataAPI } from "./hooks/useDataAPI";
import { UsersContextProvider } from "./contexts/UsersContext";
import { useCartContext } from "./hooks/useContextHooks/useCartContext";

// Pages & Components
import { Dashboard, Login, Signup, Success } from "./pages/index"
import { Navbar } from "./components/index"
const Cart = lazy(() => import("./pages/cart/Cart"))
const Search = lazy(() => import("./pages/search/Search"))
const Product = lazy(() => import("./pages/product/Product"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const Category = lazy(() => import("./pages/category/Category"))

function App() {
  const { getData, getSingleDocument } = useDataAPI();
  const { user } = useAuthContext();
  const { dispatchProducts } = useProductsContext();
  const { dispatchCategories } = useCategoriesContext();
  const { dispatchCart } = useCartContext();

  useEffect(() => {
    getData("products")
    .then(response => dispatchProducts({type: "SET_PRODUCTS", payload: response}))
    .catch(error => console.log(error))

    getData("categories")
    .then(response => dispatchCategories({type: "SET_CATEGORIES", payload: response}))
    .catch(error => console.log(error))

    if (user) {
      getSingleDocument("carts", user.cartId)
      .then(response => dispatchCart({type: "SET_CART", payload: response}))
      .catch(error => console.log(error))
    }

  }, [getData, getSingleDocument, dispatchProducts, dispatchCategories, dispatchCart, user])

  return (
    <div>
      <BrowserRouter>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login />}/>
          <Route path="/signup" element={user ? <Navigate to="/"/> : <Signup />}/>
          <Route path="/success" element={<Success />}/>

          <Route path="/categories/:categoryName" element={
            <Suspense>
              <Category />
            </Suspense>
          }/>

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

          <Route path="/search/:querry" element={
            <Suspense>
              <Search />
            </Suspense>
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
