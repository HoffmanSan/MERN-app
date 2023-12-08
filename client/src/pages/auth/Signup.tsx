// IMPORTS
import { Link } from "react-router-dom";
import { useAuthAPI } from "../../hooks/useAuthAPI";

// COMPONENTS
import { AuthForm } from "../../components";

export default function Signup() {
  // GLOBAL STATES & UTILITIES
  const {signup, error, isLoading} = useAuthAPI();

  // ---- SIGNUP PROCESS ---- \\
  const handleSignup = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();

    await signup(email, password);
  };

  return (
    <div className="flex items-center justify-center mx-auto min-h-9/10-screen max-mobile:text-sm max-mobile:w-11/12 max-laptop:w-10/12">
      <div className="p-8 mx-auto text-orange-400 bg-white rounded-lg shadow-lg w-96">
        <h3 className="text-center pb-7 max-mobile:text-base">ZAREJESTRUJ SIĘ</h3>

        <AuthForm handleSubmit={handleSignup} error={error} isLoading={isLoading} submitButtonText="załóż konto"/>

        <div className="mt-6 text-center">
          <p>Posiadasz już konto?</p>
          <Link to="/login" className="font-bold">Zaloguj się</Link>
        </div>
        
      </div>
    </div>
  )
}
