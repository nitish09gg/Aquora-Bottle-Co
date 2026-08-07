import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-[#1f1f1f] bg-black/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A85A] text-xl font-bold text-black">
            A
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Aquora
            </h2>

            <p className="-mt-1 text-[11px] uppercase tracking-[0.45em] text-[#D4A85A]">
              Bottle Co.
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}

        <div className="hidden items-center gap-8 text-sm font-medium text-white lg:flex">

          <a href="#" className="nav-item">
            Home
          </a>

          <a href="#collections" className="nav-item">
            Bottle Collection
          </a>

          <a href="#industries" className="nav-item">
            Industries
          </a>

          <a href="#works" className="nav-item">
            How It Works
          </a>

          <a href="#portfolio" className="nav-item">
            Our Work
          </a>

          <a href="#about" className="nav-item">
            About
          </a>

          <a href="#contact" className="nav-item">
            Contact
          </a>

        </div>

        {/* Buttons */}

        <div className="hidden items-center gap-3 lg:flex">

          <Link
            to="/login"
            className="rounded-lg border border-[#444] px-5 py-2.5 font-semibold text-white transition hover:border-[#D4A85A]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-[#D4A85A] px-5 py-2.5 font-semibold text-black transition hover:bg-[#e1b96b]"
          >
            Request Mockup →
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;