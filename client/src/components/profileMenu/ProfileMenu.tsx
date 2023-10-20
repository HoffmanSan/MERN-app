// Imports
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useRef } from "react";

// TS type
type ProfileMenuProps = {
  setIsOpen: (v: boolean) => void
}

export default function ProfileMenu({setIsOpen}: ProfileMenuProps) {
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const ref = useRef<HTMLUListElement>(null)

  // Hide menu if the user clicks somewhere else on the page
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [setIsOpen])

  return (
    <ul ref={ref} className="absolute p-2 m-0 text-white bg-orange-400">
      {!state.user ?
      <>
        <li className="hover:font-bold"><Link to="/login" onClick={() => {setIsOpen(false)}}>Logowanie</Link></li>
        <li className="hover:font-bold"><Link to="/signup" onClick={() => {setIsOpen(false)}}>Rejestracja</Link></li>
        <li className="hover:font-bold"><Link to="/admin" onClick={() => {setIsOpen(false)}}>Admin</Link></li>
      </>
      :
      <li className="hover:font-bold" onClick={() => {setIsOpen(false); logout()}}>Wyloguj</li>
      }
    </ul>
  )
}