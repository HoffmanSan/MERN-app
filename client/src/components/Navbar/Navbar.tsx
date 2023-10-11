// Imports
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

// Component unique styles
import "./navbar.css";


export default function Navbar() {
  const [searchInput, setSearchInput] = useState('')
  const { state } = useAuthContext();
  const { logout } = useLogout();

  return (
    <nav className="bg-orange-400 top-0 sticky z-10">
      <ul className="py-2 w-9/12 flex mx-auto">

        <li>
          <Link to="/">
              <h1 className="text-3xl text-white font-bold">Sklepico.pl</h1>
          </Link>
        </li>
        
        <li id="search" className="px-1 flex mx-auto w-2/6">
          <input
            type="text"
            name="search-bar"
            className="rounded px-2 w-full"
            placeholder="Szukaj..."
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <Link to={searchInput ? `/search/${searchInput}` : "/"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="m-1 w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
        </li>

        <li id="homepage" className="px-1">
          <Link  to="/" className="bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="m-1 w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          </Link>
        </li>

        <li id="shopping-cart" className="px-1">
          <Link to="/cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="m-1 w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </Link>
        </li>

        <li id="account" className="px-1">
          <Link  to="/account">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="m-1 w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
          <ul id="dropdown-account" className="hidden absolute bg-orange-400 rounded-md p-1">
          {!state.user ?
            <>
              <li className="dropdown-link"><Link to="/login">Logowanie</Link></li>
              <li className="dropdown-link"><Link to="/signup">Rejestracja</Link></li>
            </>
            :
            <li className="dropdown-link" onClick={() => logout()}>Wyloguj</li>
          }
          </ul>
        </li>

      </ul>
    </nav>
  )
}
