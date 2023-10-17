// TS types
type TextInputProps = {
  handleChange: (v: string) => void,
  value: string,
  type?: "password",
  id: string
}

export default function TextInput({handleChange, value, type, id}: TextInputProps) {
  return (
    <input
      className="p-2 my-1 text-black border border-orange-400 rounded-md"
      id={id}
      type={type}
      onChange={(e) => handleChange(e.target.value)}
      value={value}
    />
  )
}
