import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link to={user ? "/browse" : "/"} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10">
            <svg
              className="h-5 w-5 text-[#c9a24b]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3c3.2 4 6 7.4 6 10.6A6 6 0 0 1 6 13.6C6 10.4 8.8 7 12 3z" />
            </svg>
          </span>

          <span className="leading-tight">
            <span className="block text-base font-bold tracking-[0.18em] text-white">
              AQUORA
            </span>
            <span className="block text-[9px] font-semibold tracking-[0.32em] text-[#c9a24b]">
              BOTTLE CO.
            </span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 text-[13px] font-medium text-slate-300 lg:flex">
          {!user && (
            <>
              <a href="#top" className="text-[#c9a24b] transition hover:text-[#c9a24b]">
                Home
              </a>
              <a href="#collection" className="transition hover:text-[#c9a24b]">
                Bottle Collection
              </a>
              <a href="#industries" className="transition hover:text-[#c9a24b]">
                Industries
              </a>
              <a href="#how-it-works" className="transition hover:text-[#c9a24b]">
                How It Works
              </a>
              <a href="#our-work" className="transition hover:text-[#c9a24b]">
                Our Work
              </a>
              <a href="#about" className="transition hover:text-[#c9a24b]">
                About Us
              </a>
              <a href="#contact" className="transition hover:text-[#c9a24b]">
                Contact
              </a>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Link
                to="/browse"
                className="rounded-full border border-white/25 px-5 py-2 text-sm font-medium text-white transition hover:border-[#c9a24b] hover:text-[#c9a24b]"
              >
                Explore Collection
              </Link>

              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:border-[#c9a24b] hover:text-[#c9a24b] sm:block"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-full bg-[#c9a24b] px-5 py-2.5 text-sm font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/20 transition hover:bg-[#b8923f]"
              >
                Request a Mockup →
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;