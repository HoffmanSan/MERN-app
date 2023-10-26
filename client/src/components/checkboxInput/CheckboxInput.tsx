// Imports

// Unique styles
import "./checkboxInput.css"

// TS types
type CheckboxInputProps = {
  category: string,
  categories: string[]
  handleClick: () => void 
}

export default function CheckboxInput({category, handleClick, categories}: CheckboxInputProps) {

  return (
    <>
      {/* original checkbox style has been replaced with custom-made one - see CSS file */}
      <input
        type="checkbox"
        id={category}
        checked={categories.includes(category)}
        readOnly
      />
      <span onClick={() => handleClick()}/>
    </>
  )
}
