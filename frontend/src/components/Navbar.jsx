import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Logo */}
        <Link to={user ? "/browse" : "/"} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-lg">
            A
          </span>

          <span className="text-lg font-bold tracking-tight">
            Aquora <span className="text-sky-600">Bottle Co.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {!user && (
            <>
              <a href="#how-it-works" className="transition hover:text-sky-600">
                How It Works
              </a>

              <a href="#collection" className="transition hover:text-sky-600">
                Bottle Collection
              </a>

              <a
                href="#sustainability"
                className="transition hover:text-sky-600"
              >
                Sustainability
              </a>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link
                to="/browse"
                className="rounded-full border border-sky-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-600 hover:text-sky-600"
              >
                Explore Collection
              </Link>

              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-semibold text-slate-700 transition hover:text-sky-600 sm:block"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-700"
              >
                Request Mockup
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
