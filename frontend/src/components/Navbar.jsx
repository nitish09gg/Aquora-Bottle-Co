import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ handleLogout }) {
 
  const { user } = useAuth();

  
  return (
    <header className="border-b border-sky-100 bg-white/80 backdrop-blur">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-bold text-white">
          A
        </span>

        <span className="text-lg font-bold">
          Aquora <span className="text-sky-600">Bottle Co.</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="h-10 w-10 rounded-full border border-sky-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
        >
          Logout
        </button>
      </div>
    </nav>
  </header>
  );
}

export default Navbar;
