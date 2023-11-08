// Imports
import { useState } from "react"

// Components
import { LoadingSpinner } from "../../index";

// TS types
type AuthFormProps = {
  handleSubmit: (e: React.FormEvent, email: string, password: string) => void,
  error: string,
  isLoading: boolean,
  submitButtonText: string,
}

export default function AuthForm({handleSubmit, error, isLoading, submitButtonText}: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form className="flex flex-col mx-auto" onSubmit={(e) => handleSubmit(e, email, password)}>

      <label htmlFor="login-email" className="text-lg">Adres e-mail</label>
      <input
        className="p-2 my-1 text-black border border-orange-400 rounded-md"
        id="login-email"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label htmlFor="login-password" className="text-lg">Hasło</label>
      <input
        className="p-2 my-1 text-black border border-orange-400 rounded-md"
        id="login-password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button className="mt-5 tracking-wider uppercase btn" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : submitButtonText}</button>
      {error && <div className="error">{error}</div>}
      
    </form>
  )
}
