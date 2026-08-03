import { Link } from "react-router-dom";

function BottleCustomization() {
  return (
    <div className="relative z-10 w-full max-w-lg">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
        Your brand, in hand
      </p>

      <h2 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-slate-900">
        Made for your venue.
      </h2>

      <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
        From logo to table service, preview your custom reusable bottle before
        production starts.
      </p>

      <div className="mt-10 rounded-[2rem] border border-white/90 bg-white/70 p-7 shadow-xl shadow-sky-100 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Live bottle preview
          </p>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Mockup in 48 hrs
          </span>
        </div>

        <div className="mt-6 flex h-80 items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 to-cyan-100/80">
          <div className="auth-bottle">
            <span className="auth-bottle-cap" />
            <span className="auth-bottle-neck" />

            <div className="auth-bottle-body">
              <div className="auth-bottle-water" />

              <div className="auth-bottle-label">
                <p>AQUORA</p>
                <span />
                <small>STILL WATER</small>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-sky-50 p-3 text-center">
            <p className="font-bold text-sky-700">01</p>
            <p className="mt-1 text-xs text-slate-500">Your logo</p>
          </div>

          <div className="rounded-2xl bg-sky-50 p-3 text-center">
            <p className="font-bold text-sky-700">02</p>
            <p className="mt-1 text-xs text-slate-500">3D preview</p>
          </div>

          <div className="rounded-2xl bg-sky-50 p-3 text-center">
            <p className="font-bold text-sky-700">03</p>
            <p className="mt-1 text-xs text-slate-500">Production</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryAnimation() {
  return (
    <div className="relative z-10 w-full max-w-lg">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
        Hospitality, delivered
      </p>

      <h2 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-slate-900">
        From our studio to your table.
      </h2>

      <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
        Every production batch is scheduled carefully and delivered directly
        to your venue.
      </p>

      <div className="mt-10 rounded-[2rem] border border-white/90 bg-white/70 p-7 shadow-xl shadow-sky-100 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Production batch #AQ-204
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Destination: Your venue
            </p>
          </div>

          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
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

        <div className="mt-8 rounded-2xl bg-sky-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">
              Delivery progress
            </span>
            <span className="font-bold text-sky-700">80%</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Estimated delivery: Friday, 10:30 AM
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthLayout({
  mode,
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  const isSignup = mode === "signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7FCFF] text-slate-900">
      <div className="water-blob water-blob-one" />
      <div className="water-blob water-blob-two" />
      <div className="water-blob water-blob-three" />

      <main
        key={mode}
        className="auth-page-enter relative z-10 grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]"
      >
        <section className="flex px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="auth-panel-enter my-auto w-full max-w-md">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-lg shadow-sky-200">
                A
              </span>

              <span className="text-lg font-bold tracking-tight">
                Aquora <span className="text-sky-600">Bottle Co.</span>
              </span>
            </Link>

            <div className="mt-12 rounded-[2rem] border border-white/90 bg-white/75 p-7 shadow-xl shadow-sky-100/70 backdrop-blur-xl sm:p-9">
              <p className="text-sm font-bold tracking-wide text-sky-600">
                {eyebrow}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 leading-7 text-slate-500">{description}</p>

              <div className="mt-8">{children}</div>

              <div className="mt-7 border-t border-sky-100 pt-6 text-center text-sm text-slate-500">
                {footer}
              </div>
            </div>
          </div>
        </section>

        <aside className="auth-visual-enter relative hidden overflow-hidden border-l border-sky-100 bg-gradient-to-br from-sky-100/70 via-cyan-50 to-white px-12 py-16 lg:flex lg:items-center xl:px-20">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="absolute -bottom-28 left-16 h-96 w-96 rounded-full bg-sky-200/60 blur-3xl" />

          {isSignup ? <BottleCustomization /> : <DeliveryAnimation />}
        </aside>
      </main>
    </div>
  );
}

export default AuthLayout;