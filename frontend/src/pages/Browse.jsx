import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"

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
const collections = [
  { name: "Glass Bottles", label: "AQUORA", labelClass: "bg-slate-900 text-white" },
  { name: "Frosted Glass", label: "PUREZA", labelClass: "bg-white text-slate-600 border border-slate-200" },
  { name: "Premium Collection", label: "LUXE", labelClass: "bg-[#c9a24b] text-[#121212]" },
  { name: "Hotel Collection", label: "PANORAMA", labelClass: "bg-sky-950 text-white" },
  { name: "Restaurant Collection", label: "BISTRO", labelClass: "bg-slate-700 text-white" },
  { name: "Eco-Friendly", label: "NATURE", labelClass: "bg-emerald-100 text-emerald-700" },
];

const industries = [
  {
    name: "Hotels",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" />
        <path d="M9 22v-4h6v4" />
        <path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
      </svg>
    ),
  },
  {
    name: "Restaurants",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h18" />
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="M12 9V7" />
        <circle cx="12" cy="6" r="1" />
      </svg>
    ),
  },
  {
    name: "Cafés",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h2a3 3 0 0 1 0 6h-2" />
        <path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z" />
        <path d="M7 2v3M11 2v3" />
      </svg>
    ),
  },
  {
    name: "Resorts",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21v-8" />
        <path d="M12 13C12 9 9 7 5 7c2 4 4 6 7 6z" />
        <path d="M12 13c0-4 3-6 7-6-2 4-4 6-7 6z" />
        <path d="M8 21h8" />
      </svg>
    ),
  },
  {
    name: "Corporate Offices",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
        <path d="M2 22h20" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </svg>
    ),
  },
  {
    name: "Events",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    name: "Retail Brands",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 8v14h18V8l-3-6H6z" />
        <path d="M3 8h18" />
        <path d="M16 12a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

const whyFeatures = [
  {
    name: "Premium Quality Glass",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <path d="M2 9h20" />
        <path d="M12 3l-4 6 4 12 4-12-4-6" />
      </svg>
    ),
  },
  {
    name: "Custom Label & Design",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    name: "Low Minimum Order Quantity",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    name: "Fast Production",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    name: "Waterproof Labels",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c4 5 7 8.6 7 12a7 7 0 1 1-14 0c0-3.4 3-7 7-12z" />
      </svg>
    ),
  },
  {
    name: "Luxury Packaging",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" />
        <path d="M5 12v10h14V12" />
        <path d="M12 8v14" />
        <path d="M12 8c-2 0-4-1-4-3s3-3 4 3z" />
        <path d="M12 8c2 0 4-1 4-3s-3-3-4 3z" />
      </svg>
    ),
  },
  {
    name: "Global Shipping",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
      </svg>
    ),
  },
  {
    name: "Dedicated Support",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

function Browse() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const steps = [
    {
      title: "1. Share Your Logo",
      desc: "Send us your logo, brand ideas and requirements.",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M4 20h16" />
        </svg>
      ),
    },
    {
      title: "2. Choose Bottle Style",
      desc: "Select your bottle size and cap you prefer.",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2h4" />
          <path d="M10 2v4l-3 4v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10l-3-4V2" />
        </svg>
      ),
    },
    {
      title: "3. Send Query",
      desc: "Our team creates a custom label for your approval.",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "4. Manufacture & Deliver",
      desc: "We produce with care and deliver to your door.",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4h14v12H1z" />
          <path d="M15 9h4l4 4v3h-8V9z" />
          <circle cx="5.5" cy="18.5" r="2" />
          <circle cx="18.5" cy="18.5" r="2" />
        </svg>
      ),
    },
  ];

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FCFF] text-slate-900">
      <Navbar handleLogout={handleLogout} />
      <main className="relative z-10">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden">
          <img
            src="/images/hero-transparent.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/30" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Premium Custom-Label Water Bottles for{" "}
                <span className="text-[#c9a24b]">Hotels, Restaurants & Cafés</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                Elevate your brand experience with beautifully crafted,
                eco-friendly glass bottles customized with your logo and label.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="rounded-md bg-[#c9a24b] px-6 py-3.5 text-center text-sm font-semibold text-[#121212] shadow-xl shadow-[#c9a24b]/20 transition hover:-translate-y-0.5 hover:bg-[#b8923f]"
                >
                  Upload your Logo
                </Link>

                <a
                  href="#collection"
                  className="rounded-md border border-white/30 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-[#c9a24b] hover:text-[#c9a24b]"
                >
                  Explore Collection
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-9 gap-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-[#c9a24b]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                      <path d="M2 9h20" />
                    </svg>
                  </span>
                  <p className="max-w-[90px] text-xs font-medium leading-4 text-slate-300">
                    Premium Quality Glass
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#c9a24b]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-9 16-9 0 12-5 16-9 16z" />
                      <path d="M4 21c4-6 8-9 12-11" />
                    </svg>
                  </span>
                  <p className="max-w-[90px] text-xs font-medium leading-4 text-slate-300">
                    Eco-Friendly Materials
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#c9a24b]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                      <path d="M3 8l9 5 9-5" />
                    </svg>
                  </span>
                  <p className="max-w-[90px] text-xs font-medium leading-4 text-slate-300">
                    Low MOQ Available
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#c9a24b]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18" />
                    </svg>
                  </span>
                  <p className="max-w-[90px] text-xs font-medium leading-4 text-slate-300">
                    Worldwide Delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/hero-bottle.png"
                alt="Custom branded glass water bottles"
                className="mx-auto w-full max-w-lg object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className="bg-[#f6f1e7] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-xs font-bold tracking-[0.3em] text-[#b8923f]">
              HOW IT WORKS
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Simple Steps to Your Branded Bottle
            </h2>

            <div className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-[#c9a24b]/40 lg:block" />

              {steps.map((step) => (
                <div key={step.title} className="relative text-center">
                  <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a24b]/60 bg-[#fbf7ee] text-[#b8923f] shadow-sm">
                    {step.icon}
                  </span>
                  <p className="mt-5 text-sm font-bold text-slate-900">{step.title}</p>
                  <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-slate-500">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COLLECTION ================= */}
        <section id="collection" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-xs font-bold tracking-[0.3em] text-[#b8923f]">
              OUR COLLECTIONS
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Bottle Styles for Every Brand
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
              {collections.map((item) => (
                <div
                  key={item.name}
                  className="group rounded-xl border border-slate-200 bg-[#f7f5f1] p-4 transition hover:border-[#c9a24b]/60 hover:shadow-lg"
                >
                  <div className="flex h-44 items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="h-3.5 w-4 rounded-t-sm bg-slate-900" />
                      <div className="h-5 w-3.5 border-x border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100" />
                      <div className="relative h-28 w-11 overflow-hidden rounded-t-[6px] rounded-b-[14px] border border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 shadow-sm">
                        <div
                          className={`absolute inset-x-0 top-7 flex h-11 items-center justify-center ${item.labelClass}`}
                        >
                          <span className="text-[6px] font-bold tracking-[0.18em]">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                    <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#b8923f]">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= INDUSTRIES ================= */}
        <section id="industries" className="bg-white pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-xs font-bold tracking-[0.3em] text-[#b8923f]">
              INDUSTRIES WE SERVE
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Trusted by Businesses Worldwide
            </h2>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-7">
              {industries.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-[#faf8f4] px-4 py-7 text-center transition hover:border-[#c9a24b]/60 hover:shadow-md"
                >
                  <span className="text-[#b8923f]">{item.icon}</span>
                  <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE ================= */}
        <section id="about" className="bg-[#14291f] py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.3fr_0.7fr] lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#c9a24b]">
                WHY CHOOSE AQUORA?
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-snug text-white sm:text-4xl">
                Quality Bottles. Stronger Brand. Better Experience.
              </h2>
              <Link
                to="/signup"
                className="mt-8 inline-block rounded-md bg-[#c9a24b] px-6 py-3 text-sm font-semibold text-[#121212] transition hover:bg-[#b8923f]"
              >
                Know More About Us →
              </Link>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {whyFeatures.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 text-[#c9a24b]">
                    {feature.icon}
                  </span>
                  <p className="text-sm font-medium text-slate-200">{feature.name}</p>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
              <img
                src="/images/hero-transparent.jpg"
                alt="Aquora bottled presentation"
                className="h-72 w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================= OUR WORK ================= */}
        <section id="our-work" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-[#b8923f]">OUR WORK</p>
                <h2 className="mt-3 max-w-xs font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
                  Brands That Trust Us
                </h2>
              </div>

              <a
                href="#our-work"
                className="rounded-md border border-[#c9a24b] px-5 py-2.5 text-sm font-semibold text-[#b8923f] transition hover:bg-[#c9a24b] hover:text-[#121212]"
              >
                View More Work →
              </a>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="group relative h-48 overflow-hidden rounded-xl">
                  <img
                    src="/images/hero-transparent.jpg"
                    alt="Branded bottles in service"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIAL ================= */}
        <section className="bg-[#f6f1e7] py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 md:flex-row md:gap-12 lg:px-8">
            <span className="font-serif text-7xl leading-none text-[#c9a24b]">“</span>

            <p className="flex-1 text-center text-sm leading-7 text-slate-600 md:text-left">
              Aquora Bottle Co. helped us create elegant branded bottles that
              perfectly match our restaurant's identity. The quality and service
              are exceptional!
            </p>

            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1d1a16] text-center text-[8px] font-bold leading-tight text-[#c9a24b]">
                BISTRO
                <br />
                27
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Bistro 27</p>
                <p className="text-xs text-slate-500">Restaurant</p>
                <p className="mt-1 text-sm tracking-widest text-[#c9a24b]">★★★★★</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section id="contact" className="bg-[#0a0a0a] py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:px-8 lg:text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Ready to Put Your Brand on Every Table?
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Request a free mockup or talk to our bottle branding experts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-md bg-[#c9a24b] px-6 py-3 text-center text-sm font-semibold text-[#121212] transition hover:bg-[#b8923f]"
              >
                Request a Mockup →
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-[#c9a24b] hover:text-[#c9a24b]"
              >
                Talk to Our Team →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Browse;
