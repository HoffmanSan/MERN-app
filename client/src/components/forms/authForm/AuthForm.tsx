// IMPORTS
import { useState } from "react";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type AuthFormProps = {
  handleSubmit: (e: React.FormEvent, email: string, password: string) => void
  error: string
  isLoading: boolean
  submitButtonText: string
}

export default function AuthForm({handleSubmit, error, isLoading, submitButtonText}: AuthFormProps) {
  // LOCAL STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="flex flex-col mx-auto" onSubmit={(e) => handleSubmit(e, email, password)}>

      {/* email input */}
      <label htmlFor="login-email" className="text-lg max-mobile:text-sm max-tablet:text-base">Adres e-mail</label>
      <input
        className="p-2 my-1 text-black border border-orange-400 rounded-md"
        id="login-email"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      {/* password input */}
      <label htmlFor="login-password" className="text-lg max-mobile:text-sm max-tablet:text-base">Hasło</label>
      <input
        className="p-2 my-1 text-black border border-orange-400 rounded-md"
        id="login-password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button className="mt-5 tracking-wider uppercase btn max-mobile:text-xs" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : submitButtonText}</button>

      {error && <div className="mt-3 error max-mobile:text-sm">{error}</div>}
      
    </form>
  )
}
