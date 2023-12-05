// IMPORTS
import { Link } from "react-router-dom";
import { useAuthAPI } from "../../hooks/useAuthAPI";

// CoOMPONENTS
import { AuthForm } from "../../components";

export default function Login() {
  // GLOBAL STATES & UTILITIES
  const {login, error, isLoading} = useAuthAPI();

  // ---- LOGIN PROCESS ---- \\
  const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-9/10-screen">
      <div className="p-8 mx-auto text-orange-400 bg-white rounded-lg shadow-lg w-96">
        <h3 className="text-center pb-7">ZALOGUJ SIĘ</h3>

        <AuthForm handleSubmit={handleLogin} error={error} isLoading={isLoading} submitButtonText="logowanie"/>

        <div className="mt-6 text-center">
          <p>Nie masz jeszcze konta?</p>
          <Link to="/signup" className="font-bold">Zarejestruj się</Link>
        </div>
        
      </div>
    </div>
  )
}