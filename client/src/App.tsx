// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages & Components
import { Dashboard, Login, Signup, Product, AdminPanel } from "./pages/index";
import { Navbar } from "./components/index";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/product/:id" element={<Product />}/>
          <Route path="/admin" element={<AdminPanel />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
