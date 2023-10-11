// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages & Components
import { Dashboard, Login, Signup } from "./pages/index";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
