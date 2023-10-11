// Imports
import { useState } from "react"
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {login, error, isLoading} = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <div className="flex justify-center">
      <form className="auth-form mx-auto" onSubmit={handleSubmit}>
        <h3 className="text-xl text-center text-orange-400 font-bold pb-7">ZALOGUJ SIĘ</h3>

        <label htmlFor="login-email" className="text-lg text-orange-400">Adres e-mail</label>
        <input
          className="my-1 p-2 rounded-md border border-orange-400"
          type="text"
          id="login-email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label htmlFor="login-password" className="text-lg text-orange-400">Hasło</label>
        <input
          className="my-1 p-2 rounded-md border border-orange-400"
          id="login-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button className="btn mt-6" disabled={isLoading}>LOGOWANIE</button>
        {error && <div className="mt-6 text-red-400 text-center">{error}</div>}

        <div className="text-center mt-6 text-orange-400">
          <p>Nie masz jeszcze konta?</p>
          <Link to="/signup" className="font-bold">Zarejestruj się</Link>
        </div>
      </form>
    </div>
  )
}