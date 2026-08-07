import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F6F4EF] via-[#F2F0EB] to-[#ECE8E1] pt-28 text-black">
      {/* Background Glow */}
      <div className="hero-bg-glow" />

      <div className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">

        {/* LEFT SIDE */}

        <div className="relative z-10">

          <p className="hero-tag">
            PREMIUM CUSTOM GLASS BOTTLES
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-[#1E1E1E] lg:text-7xl">
            Premium Custom Label
            <br />

            Water Bottles for
            <br />

            <span className="text-[#D4A85A]">
              Hotels, Restaurants
            </span>

            <br />

            & Cafés
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
            Give every guest a premium experience with beautifully branded
            reusable glass bottles designed exclusively for luxury hospitality.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/signup"
              className="hero-primary-btn"
            >
              Request Mockup →
            </Link>

            <a
              href="#collections"
              className="hero-secondary-btn"
            >
              Explore Collection
            </a>

          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">

            <div>
              <h3 className="hero-stat">
                Premium
              </h3>

              <p className="hero-stat-text">
                Quality Glass
              </p>
            </div>

            <div>
              <h3 className="hero-stat">
                Eco
              </h3>

              <p className="hero-stat-text">
                Friendly
              </p>
            </div>

            <div>
              <h3 className="hero-stat">
                Low MOQ
              </h3>

              <p className="hero-stat-text">
                Available
              </p>
            </div>

            <div>
              <h3 className="hero-stat">
                Fast
              </h3>

              <p className="hero-stat-text">
                Delivery
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="relative flex items-center justify-center">

          <div className="hero-circle" />

          <img
            src="/images/hero-transparent.jpg"
            alt="Bottle"
            className="hero-bottle hero-bottle-left"
          />

          <img
            src="/images/hero-transparent.jpg"
            alt="Bottle"
            className="hero-bottle hero-bottle-right"
          />

        </div>

      </div>
    </section>
  );
}

export default Hero;