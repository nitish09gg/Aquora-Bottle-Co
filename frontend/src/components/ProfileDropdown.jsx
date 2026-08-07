import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfileDropdown() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm transition hover:shadow-md"
      >
        {user.photo ? (
          <img
            src={user.photo}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold">{user.name}</p>
        </div>

        <svg
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-xl border bg-white shadow-xl">
          <div className="border-b px-4 py-4">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <Link
            to="/profile"
            className="block px-4 py-3 hover:bg-slate-100"
          >
            👤 My Profile
          </Link>

          <Link
            to="/browse"
            className="block px-4 py-3 hover:bg-slate-100"
          >
            📦 Browse
          </Link>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;