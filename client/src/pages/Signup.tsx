// Imports
import { useState } from "react"
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {signup, error, isLoading} = useSignup();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div className="flex justify-center">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3 className="text-xl text-center text-orange-400 font-bold pb-7">ZAREJESTRUJ SIĘ</h3>

        <label htmlFor="signup-email" className="text-lg text-orange-400">Adres e-mail</label>
        <input
          className="my-1 p-2 rounded-md border border-orange-400"
          id="signup-email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label htmlFor="signup-password" className="text-lg text-orange-400">Hasło</label>
        <input
          className="my-1 p-2 rounded-md border border-orange-400"
          id="signup-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button className="btn mt-6" disabled={isLoading}>REJESTRACJA</button>
        {error && <div className="mt-6 text-red-400 text-center">{error}</div>}

        <div className="text-center mt-6 text-orange-400">
          <p>Posiadasz już konto?</p>
          <Link to="/login" className="font-bold">Zaloguj się</Link>
        </div>
      </form>
    </div>
  )
}
