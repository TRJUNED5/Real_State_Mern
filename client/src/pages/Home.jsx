
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

import ListingItem from '../components/ListingItem';

import {
  FaSearch,
  FaHome,
  FaKey,
  FaArrowRight,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaShieldAlt,
  FaHeart,
  FaCheckCircle,
  FaBuilding,
  FaStar,
  FaArrowUp,
} from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch property listings
  useEffect(() => {
    let active = true;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');

        const endpoints = [
          '/api/listing/get?offer=true&limit=4',
          '/api/listing/get?type=rent&limit=4',
          '/api/listing/get?type=sale&limit=4',
        ];

        const responses = await Promise.all(
          endpoints.map((url) => fetch(url))
        );

        for (const response of responses) {
          if (!response.ok) {
            throw new Error('Unable to load properties.');
          }
        }

        const [offers, rentals, sales] = await Promise.all(
          responses.map((res) => res.json())
        );

        if (!active) return;

        setOfferListings(Array.isArray(offers) ? offers : []);
        setRentListings(Array.isArray(rentals) ? rentals : []);
        setSaleListings(Array.isArray(sales) ? sales : []);
      } catch (error) {
        if (active) setError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchListings();

    return () => {
      active = false;
    };
  }, []);

  // Scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Search properties
  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('searchTerm', searchTerm.trim());
    }

    params.set('type', propertyType);

    navigate(`/search?${params.toString()}`);
  };

  // Remove duplicate listings from slider
  const featuredListings = Array.from(
    new Map(
      [...offerListings, ...rentListings, ...saleListings]
        .map((listing) => [listing._id, listing])
    ).values()
  ).slice(0, 6);

  const totalLoadedListings = new Set(
    [...offerListings, ...rentListings, ...saleListings]
      .map((listing) => listing._id)
  ).size;

  // Loading skeleton component
  const ListingSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200" />

      <div className="p-5 space-y-4">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-9 bg-slate-200 rounded" />
      </div>
    </div>
  );

  // Reusable property section
  const PropertySection = ({
    title,
    subtitle,
    listings,
    link,
    linkText,
    icon,
  }) => {
    if (!loading && listings.length === 0) return null;

    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                {icon}
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Tazan Estate
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {title}
              </h2>

              <p className="text-slate-500 mt-3 max-w-xl">
                {subtitle}
              </p>
            </div>

            <Link
              to={link}
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-4 transition-all"
            >
              {linkText}
              <FaArrowRight />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center xl:justify-start gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full sm:w-[330px]"
                  >
                    <ListingSkeleton />
                  </div>
                ))
              : listings.map((listing) => (
                  <ListingItem
                    listing={listing}
                    key={listing._id}
                  />
                ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-slate-900">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/30" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-24">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-7">
              <FaStar className="text-amber-400" />

              <span className="text-white text-sm font-medium">
                Welcome to Tazan Estate
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Find a Place
              <br />
              You'll Love to
              <span className="text-amber-400"> Call Home.</span>
            </h1>

            <p className="text-slate-200 text-base md:text-lg mt-7 max-w-xl leading-relaxed">
              Discover beautiful homes, modern apartments,
              and exciting real estate opportunities.
              Your next chapter starts with Tazan Estate.
            </p>

            {/* SEARCH BOX */}
            <div className="mt-10 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-2xl">

              {/* Search tabs */}
              <div className="flex gap-2 mb-5">
                {[
                  { label: 'All Properties', value: 'all' },
                  { label: 'Buy', value: 'sale' },
                  { label: 'Rent', value: 'rent' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setPropertyType(tab.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      propertyType === tab.value
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex items-center gap-3 flex-1 border border-slate-200 rounded-xl px-4">
                  <FaMapMarkerAlt className="text-amber-500 shrink-0" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search city, address, or property..."
                    className="w-full py-4 outline-none text-slate-800 bg-transparent text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg"
                >
                  <FaSearch />
                  Search
                </button>
              </form>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-5 mt-8">
              <Link
                to="/search?type=rent"
                className="flex items-center gap-2 text-white hover:text-amber-400 transition"
              >
                <FaKey />
                Explore Rentals
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                to="/search?type=sale"
                className="flex items-center gap-2 text-white hover:text-amber-400 transition"
              >
                <FaHome />
                Browse Homes
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY STATS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden">

          <div className="flex items-center justify-center gap-4 p-7">
            <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
              <FaBuilding className="text-2xl" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : totalLoadedListings}
              </h3>

              <p className="text-sm text-slate-500">
                Featured Properties
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-7">
            <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
              <FaKey className="text-2xl" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : rentListings.length}
              </h3>

              <p className="text-sm text-slate-500">
                Featured Rentals
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-7">
            <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
              <FaHome className="text-2xl" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : saleListings.length}
              </h3>

              <p className="text-sm text-slate-500">
                Featured Homes for Sale
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PROPERTY SLIDER */}
      {featuredListings.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">

            <p className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-3">
              Explore Our Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Featured Properties
            </h2>

            <p className="text-slate-500 mt-3">
              Take a closer look at some of our latest homes.
            </p>
          </div>

          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop={featuredListings.length > 1}
            className="featured-swiper"
          >
            {featuredListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <div className="relative h-[380px] sm:h-[480px] md:h-[560px] group overflow-hidden">

                    <img
                      src={listing.imageUrls?.[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute bottom-14 left-5 sm:left-12 md:left-20 text-white max-w-2xl">

                      <span className="inline-block bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg mb-4">
                        {listing.type === 'rent'
                          ? 'FOR RENT'
                          : 'FOR SALE'}
                      </span>

                      <h3 className="text-2xl md:text-4xl font-bold mb-3">
                        {listing.name}
                      </h3>

                      <p className="flex items-center gap-2 text-slate-200 mb-4">
                        <FaMapMarkerAlt className="text-amber-400" />
                        {listing.address}
                      </p>

                      <div className="flex flex-wrap gap-5 text-sm mb-5">
                        <span className="flex items-center gap-2">
                          <FaBed />
                          {listing.bedrooms} Beds
                        </span>

                        <span className="flex items-center gap-2">
                          <FaBath />
                          {listing.bathrooms} Baths
                        </span>
                      </div>

                      <p className="text-2xl md:text-3xl font-bold text-amber-400">
                        CAD ${Number(
                          listing.offer
                            ? listing.discountPrice
                            : listing.regularPrice
                        ).toLocaleString('en-CA')}

                        {listing.type === 'rent' && (
                          <span className="text-base text-white font-normal">
                            /month
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* PROPERTY LISTINGS */}
      <div className="bg-white">

        <PropertySection
          title="Exclusive Offers"
          subtitle="Explore properties with special pricing and discover exciting opportunities."
          listings={offerListings}
          link="/search?offer=true"
          linkText="View All Offers"
          icon={<FaStar />}
        />

      </div>

      <PropertySection
        title="Homes for Rent"
        subtitle="Find a comfortable place to call home, from cozy apartments to spacious family houses."
        listings={rentListings}
        link="/search?type=rent"
        linkText="Explore Rentals"
        icon={<FaKey />}
      />

      <div className="bg-white">
        <PropertySection
          title="Homes for Sale"
          subtitle="Discover properties that match your lifestyle and take the next step toward homeownership."
          listings={saleListings}
          link="/search?type=sale"
          linkText="Explore Homes"
          icon={<FaHome />}
        />
      </div>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-14">
            <p className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-3">
              Why Tazan Estate?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              A Better Way to Find Your Home
            </h2>

            <p className="text-slate-300 max-w-2xl mx-auto mt-4">
              We make it easier to explore properties,
              discover opportunities, and connect with
              the right place for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">

            {[
              {
                icon: <FaSearch />,
                title: 'Easy Property Search',
                description:
                  'Explore homes using simple search tools and filters designed around your needs.',
              },
              {
                icon: <FaShieldAlt />,
                title: 'Convenient Experience',
                description:
                  'Browse property details, images, and important information in one place.',
              },
              {
                icon: <FaHeart />,
                title: 'Find Your Perfect Match',
                description:
                  'Discover homes that suit your lifestyle, preferences, and budget.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-2xl mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-300 leading-7 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Find Your Dream Home?
            </h2>

            <p className="text-amber-50 mt-4 max-w-xl">
              Start exploring properties today or create
              a listing to showcase your own property.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/search"
              className="bg-white text-slate-900 font-bold px-7 py-4 rounded-xl hover:bg-slate-100 transition flex items-center gap-2"
            >
              Explore Properties
              <FaArrowRight />
            </Link>

            <Link
              to="/create-listing"
              className="bg-slate-900 text-white font-bold px-7 py-4 rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
            >
              List Property
              <FaHome />
            </Link>
          </div>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-xl transition-all hover:-translate-y-1"
        >
          <FaArrowUp />
        </button>
      )}

    </div>
  );
}
