
import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Heading */}
      <div className="bg-slate-900 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          About <span className="text-amber-400">Tazan Estate</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Your Dream Home, Our Priority.
        </p>
      </div>

      {/* Who We Are Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Left Side - Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
              alt="Modern luxury home"
              className="h-[350px] w-full rounded-2xl object-cover shadow-xl md:h-[480px]"
            />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-5 py-4 shadow-lg">
              <p className="text-lg font-bold text-slate-900">
                Tazan Estate
              </p>
              <p className="text-sm text-slate-500">
                Find Your Perfect Place
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-amber-600">
              Who We Are
            </p>

            <h2 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Helping You Find a Place
              <span className="text-amber-600"> to Call Home.</span>
            </h2>

            <p className="mb-5 leading-8 text-slate-600">
              Welcome to <strong>Tazan Estate</strong>, a modern
              real estate platform designed to make finding your
              dream home simple, convenient, and enjoyable.
            </p>

            <p className="mb-5 leading-8 text-slate-600">
              Whether you're looking to buy, sell, or rent a
              property, our platform helps connect buyers,
              sellers, and renters in one convenient place.
            </p>

            <p className="mb-8 leading-8 text-slate-600">
              We believe that a home is more than just a
              property. It's where memories are created,
              families grow, and new beginnings take shape.
              Our goal is to make your real estate journey
              easier through technology and a user-friendly
              experience.
            </p>

            <Link
              to="/search"
              className="inline-block rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-amber-600 hover:shadow-lg"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-white px-6 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900">
          Your Next Chapter Starts Here
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-slate-600">
          Discover properties that fit your lifestyle and
          take the next step toward finding your perfect home
          with Tazan Estate.
        </p>

        <Link
          to="/search"
          className="inline-block rounded-lg bg-amber-500 px-8 py-3 font-semibold text-slate-950 transition-colors hover:bg-amber-400"
        >
          Find Your Dream Home
        </Link>
      </section>
    </div>
  );
}
