// Imports
import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";

// Components
import { AuthForm } from "../../components";

export default function Signup() {
  const {signup, error, isLoading} = useSignup();

  const handleSignup = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 mx-auto text-orange-400 bg-white rounded-lg shadow-lg w-96">
        <h3 className="text-center pb-7">ZAREJESTRUJ SIĘ</h3>

        <AuthForm handleSubmit={handleSignup} error={error} isLoading={isLoading} submitButtonText="załóż konto"/>

        <div className="mt-6 text-center">
          <p>Posiadasz już konto?</p>
          <Link to="/login" className="font-bold">Zaloguj się</Link>
        </div>
      </div>
    </div>
  )
}
