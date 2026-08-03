import { Link } from "react-router-dom";

const bottles = [
  {
    name: "The Horizon",
    capacity: "750ml",
    description: "Sleek clear glass designed for fine dining tables.",
    label: "Fine Dining",
    color: "from-sky-100 to-cyan-200",
  },
  {
    name: "The Reserve",
    capacity: "500ml",
    description: "A compact matte-finish bottle for boutique hotels.",
    label: "Boutique Hotels",
    color: "from-cyan-100 to-teal-200",
  },
  {
    name: "The Eco-Refill",
    capacity: "1000ml",
    description: "Heavy-duty swing-top glass for elegant table service.",
    label: "High Volume",
    color: "from-blue-100 to-sky-200",
  },
];

function Browse() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] text-slate-900">
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

          <Link
            to="/"
            className="rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Logout
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Bottle Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Browse premium hospitality glassware.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Explore reusable bottle formats designed for hotels, restaurants,
            resorts, and premium cafés.
          </p>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bottles.map((bottle) => (
            <article
              key={bottle.name}
              className="group overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
            >
              <div
                className={`flex h-64 items-center justify-center bg-gradient-to-br ${bottle.color}`}
              >
                <div className="relative">
                  <div className="mx-auto h-9 w-14 rounded-t-xl bg-sky-700" />
                  <div className="mx-auto h-14 w-20 rounded-b-2xl bg-white/80" />

                  <div className="relative -mt-1 h-40 w-36 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-xl">
                    <div className="absolute bottom-0 h-12 w-full bg-cyan-300/60" />

                    <div className="absolute left-4 top-12 w-28 rounded-xl bg-white p-3 text-center shadow-sm">
                      <p className="text-[9px] font-bold tracking-[0.2em] text-sky-700">
                        AQUORA
                      </p>
                      <p className="mt-2 text-[7px] tracking-widest text-slate-400">
                        STILL WATER
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                    {bottle.label}
                  </span>

                  <span className="text-sm font-semibold text-slate-500">
                    {bottle.capacity}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold">{bottle.name}</h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {bottle.description}
                </p>

                <button className="mt-6 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700">
                  Select for Quote
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Browse;