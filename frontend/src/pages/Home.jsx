import { Link, Navigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/browse" replace />;
  }
  
  return (

    <div className="relative min-h-screen">
      <div className="water-blob water-blob-one" />
      <div className="water-blob water-blob-two" />
      <div className="water-blob water-blob-three" />

     <Navbar/>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-24 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Sustainable hospitality glassware
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Water served with your{" "}
              <span className="text-sky-600">signature.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Custom reusable glass bottles for luxury hotels, restaurants, and
              cafés that value beautiful service and less plastic waste.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-full bg-sky-600 px-6 py-3.5 text-center font-semibold text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                Get a Free Sample Kit
              </Link>

              <a
                href="#collection"
                className="rounded-full border border-sky-200 bg-white/80 px-6 py-3.5 text-center font-semibold text-sky-700 backdrop-blur transition hover:border-sky-400 hover:bg-sky-50"
              >
                View Bottle Collection
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-7 text-sm">
              <div>
                <p className="text-2xl font-bold text-sky-700">100%</p>
                <p className="mt-1 text-slate-500">Reusable glass</p>
              </div>

              <div className="h-11 border-l border-sky-200" />

              <div>
                <p className="text-2xl font-bold text-sky-700">48 hrs</p>
                <p className="mt-1 text-slate-500">Mockup delivery</p>
              </div>

              <div className="h-11 border-l border-sky-200" />

              <div>
                <p className="text-2xl font-bold text-sky-700">5★</p>
                <p className="mt-1 text-slate-500">Hospitality quality</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex h-[440px] w-full max-w-md items-center justify-center sm:h-[500px]">
            <div className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-cyan-100 to-sky-200 blur-2xl" />

            <div className="bottle-float relative">
              <div className="mx-auto h-12 w-20 rounded-t-2xl border border-sky-200 bg-sky-700 shadow-lg" />

              <div className="mx-auto h-24 w-28 rounded-b-3xl border-x border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-100" />

              <div className="relative -mt-2 h-72 w-60 overflow-hidden rounded-[3rem] border border-sky-100 bg-gradient-to-r from-sky-100/80 via-white to-sky-100/80 shadow-2xl shadow-sky-200">
                <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-cyan-300/80 to-cyan-100/10" />

                <div className="absolute left-1/2 top-24 w-40 -translate-x-1/2 rounded-2xl border border-sky-100 bg-white/90 px-4 py-6 text-center shadow-lg">
                  <p className="text-xs font-bold tracking-[0.28em] text-sky-700">
                    AQUORA
                  </p>
                  <div className="mx-auto mt-3 h-px w-12 bg-sky-300" />
                  <p className="mt-3 text-[10px] font-semibold tracking-widest text-slate-400">
                    STILL WATER
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-0 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold text-slate-900">
                The Horizon · 750ml
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Dishwasher-safe branding
              </p>
            </div>

            <div className="absolute right-0 top-12 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold text-emerald-600">
                Zero single-use plastic
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-sky-100 bg-white/60 py-8 backdrop-blur"
        >
          <div className="mx-auto grid max-w-7xl gap-6 px-6 text-center sm:grid-cols-3 lg:px-8">
            <p className="font-medium text-slate-600">
              Designed for hotels, resorts, restaurants, and cafés
            </p>
            <p className="font-medium text-slate-600">
              Premium screen printing and engraving
            </p>
            <p className="font-medium text-slate-600">
              Built for daily in-house service
            </p>
          </div>
        </section>

        <section id="collection" className="h-1" />
        <section id="sustainability" className="h-1" />
      </main>
    </div>
  );
}

export default Home;