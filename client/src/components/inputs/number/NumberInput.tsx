// Component unique styles
import "./numberInput.css"

// TS types
type NumberInputProps = {
  name: string,
  placeholder: string,
  handleChange: (v: number) => void
}

export default function NumberInput({name, placeholder, handleChange}: NumberInputProps) {
  return (
    <input
      type="number"
      name={name}
      placeholder={placeholder}
      onChange={(e) => handleChange(Number(e.target.value))}
      className="w-5/12 py-1 px-2 border border-black"
    />
  )
}
