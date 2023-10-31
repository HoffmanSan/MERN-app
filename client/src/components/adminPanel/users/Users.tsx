// IMPORTS
import { useState, useMemo } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useUsersContext } from "../../../hooks/useUsersContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type User = {
  email: string
  createdAt: Date
  _id: number
  role: string
}

export default function Users() {
  // LOCAL STATES
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // GLOBAL STATES
  const { state: stateAuth } = useAuthContext();
  const userAuth = stateAuth.user;
  const { state: stateUsers, dispatch } = useUsersContext();
  const users = stateUsers.users;

  // SEARCH BAR LOGIC
  const debouncedQuery = useDebounce(query, 500);

  const filteredUsers = useMemo(() => {
    if (!debouncedQuery) {
      return users
    }
    return users.filter(item => 
      Object.values(item).toString().toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, users])

  // DELETE USER
  const deleteUser = async (user: User) => {
    setIsDeleting(user._id);
    setError("");
    
    axios.delete(
      `/api/users/${user._id}`,
      { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
    )
    .then(() => {
      setIsDeleting(null);
      dispatch({ type: "DELETE_USER", payload: [user] });
    })
    .catch(error => {
      setIsDeleting(null);
      setError(error.message);
      console.log(error.message);
    })
  }
  
  return (
    <>
    <div className="flex justify-center m-6 text-white">
        <input
          type="text"
          id="user-search-bar"
          className="w-3/12 p-2 text-center text-black border border-orange-400 rounded-md"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="mx-auto mb-5 error">{error}</div>}

      <table className="w-6/12 mx-auto border border-orange-400">
        <thead className="text-lg font-bold text-white">
          <tr>
            <td>Email</td>
            <td>Dołączył</td>
            <td>Uprawnienia</td>
            <td>Opcje</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers && filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{(new Date(user.createdAt)).toLocaleDateString('pl-PL')}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "Administrator" &&
                  <button
                    className="m-1 btn"
                    disabled={isDeleting !== null}
                    onClick={() => deleteUser(user)}
                  >
                    {isDeleting === user._id ? <LoadingSpinner /> : "Usuń"}
                  </button>
                }
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </>
  )
}
