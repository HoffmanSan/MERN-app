// Imports
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useLogout } from "./hooks/useLogout";

// Pages
import { Dashboard, Login, Signup } from "./pages/index";

// Components
import { Navbar } from "./components/index";

function App() {
  const { logout } = useLogout();

  const handleClick = () => {
    logout()
  }

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
      <button onClick={handleClick}>Log out</button>
    </div>
  );
}

export default App;
