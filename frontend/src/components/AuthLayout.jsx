import { Link } from "react-router-dom";

/* ---------- Right-side visual for LOGIN (matches mockup) ---------- */
function BrandShowcase() {
  return (
    <div className="relative z-10 flex w-full items-center gap-8 xl:gap-12">
      {/* CSS-rendered luxury bottle */}
      <div className="brand-stage relative flex h-[430px] w-[230px] shrink-0 items-end justify-center">
        <div className="auth-bottle">
          <span className="auth-bottle-cap" />
          <span className="auth-bottle-neck" />

          <div className="auth-bottle-body">
            <div className="auth-bottle-water" />

            <div className="auth-bottle-label">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto mb-2 h-5 w-5 text-[#c9a24b]"
              >
                <path d="M12 3c3.5 4.2 6 7.6 6 11a6 6 0 1 1-12 0c0-3.4 2.5-6.8 6-11z" />
              </svg>
              <p>AQUORA</p>
              <span />
              <small>HOTELS &amp; RESORTS</small>
            </div>
          </div>
        </div>
      </div>

      {/* Copy + feature cards */}
      <div className="max-w-sm">
        <h2 className="font-serif text-4xl font-semibold leading-[1.15] text-white xl:text-[2.75rem]">
          Your brand.
          <br />
          On every <span className="text-[#c9a24b]">table.</span>
        </h2>

        <div className="mt-5 h-px w-14 bg-[#c9a24b]" />

        <p className="mt-5 text-sm leading-6 text-slate-400">
          We help premium hotels, restaurants &amp; cafes deliver experiences
          that leave a lasting impression.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c9a24b]/40 bg-[#c9a24b]/10 text-[#c9a24b]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Custom Branding</p>
              <p className="text-xs text-slate-400">Your logo, Your identity</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c9a24b]/40 bg-[#c9a24b]/10 text-[#c9a24b]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Premium Quality</p>
              <p className="text-xs text-slate-400">Durable, safe &amp; elegant</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c9a24b]/40 bg-[#c9a24b]/10 text-[#c9a24b]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Timely Delivery</p>
              <p className="text-xs text-slate-400">On time, every time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Right-side visual for SIGNUP (dark restyle) ---------- */
function DeliveryAnimation() {
  return (
    <div className="relative z-10 w-full max-w-lg">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#c9a24b]">
        Hospitality, delivered
      </p>

      <h2 className="mt-3 max-w-md font-serif text-4xl font-semibold tracking-tight text-white">
        From our studio to your table.
      </h2>

      <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
        Every production batch is scheduled carefully and delivered directly
        to your venue.
      </p>

      <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Production batch #AQ-204
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Destination: Your venue
            </p>
          </div>

          <span className="rounded-full bg-[#c9a24b]/15 px-3 py-1 text-xs font-bold text-[#e5c06a]">
            In transit
          </span>
        </div>

        <div className="delivery-map mt-8">
          <div className="delivery-start">
            <span />
            <p>Studio</p>
          </div>

          <div className="delivery-route" />

          <div className="delivery-truck">
            <span className="delivery-truck-cargo" />
            <span className="delivery-truck-cab" />
            <span className="delivery-wheel delivery-wheel-left" />
            <span className="delivery-wheel delivery-wheel-right" />
          </div>

          <div className="delivery-destination">
            <span />
            <p>Your venue</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-300">Delivery progress</span>
            <span className="font-bold text-[#e5c06a]">80%</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#c9a24b] to-[#e5c06a]" />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Estimated delivery: Friday, 10:30 AM
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- "Why partner" strip ---------- */
function PartnerStrip() {
  const items = [
    {
      label: "Premium\nQuality Glass",
      icon: (
        <>
          <path d="M6 3h12l4 6-10 12L2 9Z" />
          <path d="M11 3 8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </>
      ),
    },
    {
      label: "Custom Label\n& Design Support",
      icon: (
        <>
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </>
      ),
    },
    {
      label: "Low Minimum\nOrder Quantity",
      icon: (
        <>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>
      ),
    },
    {
      label: "Worldwide\nShipping",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      ),
    },
    {
      label: "Dedicated\nSupport",
      icon: (
        <>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
        </>
      ),
    },
  ];

  return (
    <section className="relative z-10 border-t border-white/5 bg-[#0c0b09] px-5 py-10 sm:px-10">
      <h2 className="text-center font-serif text-xl font-semibold text-white sm:text-2xl">
        Why partner with Aquora?
      </h2>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-3 text-center">
            <span className="text-[#c9a24b]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                {item.icon}
              </svg>
            </span>
            <p className="whitespace-pre-line text-sm leading-5 text-slate-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuthLayout({ mode, eyebrow, title, description, children, footer }) {
  const isSignup = mode === "signup";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0a] text-slate-100">
      <div className="water-blob water-blob-one" />
      <div className="water-blob water-blob-two" />
      <div className="water-blob water-blob-three" />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a24b]/60 bg-[#c9a24b]/10 text-[#c9a24b]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M12 3c3.5 4.2 6 7.6 6 11a6 6 0 1 1-12 0c0-3.4 2.5-6.8 6-11z" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold tracking-[0.18em] text-white">
              AQUORA
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.3em] text-slate-400">
              BOTTLE CO.
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-400 sm:inline">
            {isSignup ? "Already have an account?" : "New here?"}
          </span>
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="rounded-lg bg-[#c9a24b] px-4 py-2 text-sm font-semibold text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#e5c06a]"
          >
            {isSignup ? "Sign In" : "Create an Account"}
          </Link>
        </div>
      </header>

      <main
        key={mode}
        className="auth-page-enter relative z-10 grid flex-1 lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Left: form panel */}
        <section className="flex border-white/5 px-5 py-10 sm:px-10 lg:border-r lg:px-14 xl:px-20">
          <div className="auth-panel-enter m-auto w-full max-w-md">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-white sm:text-[2.6rem]">
              {title}
            </h1>

            <p className="mt-2 text-base font-semibold text-[#c9a24b]">{eyebrow}</p>

            <p className="mt-4 text-sm leading-6 text-slate-400">{description}</p>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-7 border-t border-white/5 pt-6 text-center text-sm text-slate-500">
                {footer}
              </div>
            )}
          </div>
        </section>

        {/* Right: visual panel */}
        <aside className="auth-visual-enter auth-visual-dark relative hidden overflow-hidden border-l border-white/5 px-10 py-14 lg:flex lg:items-center xl:px-16">
          {isSignup ? <DeliveryAnimation /> : <BrandShowcase />}
        </aside>
      </main>

      <PartnerStrip />

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 bg-[#0a0a0a] px-5 py-5 text-xs text-slate-500 sm:flex-row sm:px-10">
        <p>© 2024 Aquora Bottle Co. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="transition hover:text-[#c9a24b]">Privacy Policy</a>
          <a href="#" className="transition hover:text-[#c9a24b]">Terms of Service</a>
          <a href="#" className="transition hover:text-[#c9a24b]">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;