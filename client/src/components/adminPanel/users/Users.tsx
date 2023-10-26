// Imports
import { useState, useMemo } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

// TS types
type User = {
  email: string
  createdAt: Date
  _id: number
}
type UsersProps = {
  users: User[];
}

export default function Users({users}: UsersProps) {
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const filteredUsers = useMemo(() => { return users.filter(item => 
    Object.values(item).toString().toLowerCase().includes(debouncedQuery.toLowerCase())
  )}, [debouncedQuery, users])
  
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
      <table className="w-6/12 mx-auto">
        <thead className="text-lg font-bold text-white">
          <tr>
            <td>Email</td>
            <td>Dołączył</td>
            <td>Opcje</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers && filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{(new Date(user.createdAt)).toLocaleDateString('pl-PL')}</td>
              <td>
                <button className="p-1 px-2 m-1 text-center text-white bg-orange-400 rounded-md hover:bg-orange-600">Usuń</button>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </>
  )
}
