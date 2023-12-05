// IMPORTS
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext";
import { useEffect, useRef } from "react";

// TYPES
type ProfileMenuProps = {
  setIsOpen: (v: boolean) => void
}

export default function ProfileMenu({setIsOpen}: ProfileMenuProps) {
  // GLOBAL STATES & UTILITIES
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const ref = useRef<HTMLUListElement>(null)

  // ---- HIDE DROPDOWN MENU IF THE USER CLICKS SOMEWHERE ELSE ON THE PAGE ---- \\
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    }
  }, [setIsOpen]);

  return (
    <ul ref={ref} className="absolute p-2 m-0 text-white bg-orange-400">

      {!user ?
        <>
          <li className="hover:font-bold"><Link to="/login">Logowanie</Link></li>
          <li className="hover:font-bold"><Link to="/signup">Rejestracja</Link></li>
        </>
      :
        <>
          {user.role === "Administrator" &&
            <li className="hover:font-bold">
              <Link to="/admin">
                Admin
              </Link>
            </li>
          }

          <li
            className="outline-none cursor-pointer hover:font-bold"
            tabIndex={0}
            onKeyUp={(key) => { if (key.code === "Enter") logout() }}
            onClick={() => logout()}
          >
            Wyloguj
          </li>

        </>
      }
      
    </ul>
  )
}