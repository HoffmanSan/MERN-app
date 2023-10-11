// Imports
import { useState } from "react"

// Component unique styles
import "./checkboxInput.css"

// TS types
type CheckboxInputProps = {
  category: string,
  handleClick: () => void 
}

export default function CheckboxInput({category, handleClick}: CheckboxInputProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {/* original checkbox style has been replaced with custom-made one - see CSS file */}
      <input
        type="checkbox"
        id={`category-${category}`}
        checked={isChecked}
        readOnly
      />
      <span onClick={() => {
        setIsChecked(!isChecked);
        handleClick();
      }}/>
      
    </>
  )
}
