// Imports
import { useState } from "react"

// Components
import { TextInput } from "../../index"

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
      <TextInput id="login-email" value={email} handleChange={setEmail}/>

      <label htmlFor="login-password" className="text-lg">Hasło</label>
      <TextInput id="login-password" value={password} handleChange={setPassword} type="password"/>

      <button className="my-5 tracking-wider btn" disabled={isLoading}>{submitButtonText.toUpperCase()}</button>
      {error && <div className="error">{error}</div>}
      
    </form>
  )
}
