import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  Zap,
  Wind,
  Tv,
  Hammer,
  Paintbrush,
  Sparkles,
  Tool,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  ChevronRight,
  Check,
  HelpCircle,
} from 'lucide-react';
import { getFeaturedTechnicians } from '@/lib/actions/technicians';
import { getCategories } from '@/lib/actions/categories';
import { TechnicianCard } from '@/components/technician/TechnicianCard';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  const [featuredRes, categoriesRes] = await Promise.all([
    getFeaturedTechnicians(6),
    getCategories(),
  ]);

  const featuredTechs = featuredRes.data || [];
  const categories = categoriesRes.data || [];

  const categoryIconMap: Record<string, any> = {
    plumbing: Wrench,
    electrical: Zap,
    'ac-repair': Wind,
    'appliance-repair': Tv,
    carpentry: Hammer,
    painting: Paintbrush,
    cleaning: Sparkles,
    handyman: Tool,
  };

  const cities = [
    {
      name: 'Kathmandu',
      area: 'Kathmandu Metropolitan',
      count: '450+ Pros',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
      tag: 'Capital Region',
    },
    {
      name: 'Lalitpur',
      area: 'Patan, Jhamsikhel, Kupondole',
      count: '280+ Pros',
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f841836d?w=600&auto=format&fit=crop&q=80',
      tag: 'Patan Valley',
    },
    {
      name: 'Bhaktapur',
      area: 'Sanothimi, Suryabinayak',
      count: '160+ Pros',
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f841836d?w=600&auto=format&fit=crop&q=80',
      tag: 'Heritage City',
    },
    {
      name: 'Pokhara',
      area: 'Lakeside, Mahendrapool',
      count: '210+ Pros',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
      tag: 'Gandaki Hub',
    },
  ];

  const testimonials = [
    {
      name: 'Ram Shrestha',
      location: 'New Baneshwor, Kathmandu',
      service: 'Plumbing & Water Tank Fix',
      rating: 5,
      comment:
        'Hari Dai arrived within 30 minutes with all replacement PPR pipes and tools. Fixed the kitchen leak cleanly and charged very reasonable rates. Highly recommended in Baneshwor!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sita Sharma',
      location: 'Jhamsikhel, Lalitpur',
      service: 'DB Box & MCB Upgrade',
      rating: 5,
      comment:
        'Very professional electrical technician! Suresh diagnosed an overloaded neutral wire in our main DB box and installed proper Schneider MCBs. Super tidy work.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bikash Gurung',
      location: 'Boudha, Kathmandu',
      service: '2BHK Deep Home Cleaning',
      rating: 5,
      comment:
        'The Sparkle Clean team did an extraordinary job! The bathrooms and kitchen look brand new. Transparent pricing with zero hidden charges. 10/10 service!',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does Sajilo Khoj verify technicians?',
      a: 'Every technician undergoes our multi-step verification process, including government ID check, CTEVT / trade skill certification verification, phone interview, and address checks before being approved.',
    },
    {
      q: 'How do I pay for the services?',
      a: 'You can pay the technician directly upon successful completion and inspection of work via Cash, eSewa, Khalti, or Mobile Banking. Starting rates and hourly estimates are displayed upfront before booking.',
    },
    {
      q: 'What if I need emergency repairs late at night or early morning?',
      a: 'You can filter technicians by "Available Now" on our search page. Technicians marked "Available Now" are active and equipped to respond to urgent repair requests.',
    },
    {
      q: 'Can I leave a review for my technician?',
      a: 'Yes! Once your service request is marked as Completed, you can rate your technician from 1 to 5 stars and leave written feedback in your Customer Dashboard to help other homeowners.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Nepal&apos;s #1 On-Demand Technician Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Find Trusted Technicians{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
                Near You in Nepal
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              From emergency plumbing leaks and electrical wiring to AC repairs and deep cleaning — connect directly with background-verified local professionals in Kathmandu, Lalitpur, Pokhara, and nationwide.
            </p>

            {/* 🔍 Hero Interactive Search Bar */}
            <div className="pt-4">
              <form
                action="/technicians"
                method="GET"
                className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/40 text-slate-900 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3"
              >
                {/* Category Dropdown */}
                <div className="w-full md:w-1/3 text-left">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 px-2">
                    Service Needed
                  </label>
                  <div className="relative">
                    <Wrench className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                    <select
                      name="category"
                      defaultValue=""
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="">All Services</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Input */}
                <div className="w-full md:w-1/3 text-left">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 px-2">
                    Your Location / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Kathmandu, Baneshwor, Pokhara..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="w-full md:w-1/3 md:self-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30"
                  >
                    <Search className="w-4 h-4 mr-1.5" /> Find Technicians
                  </Button>
                </div>
              </form>

              {/* Trending Quick Search tags */}
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 mt-4">
                <span className="font-semibold text-slate-300">Popular:</span>
                <Link
                  href="/technicians?category=plumbing"
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                >
                  #Plumber
                </Link>
                <Link
                  href="/technicians?category=electrical"
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                >
                  #Electrician
                </Link>
                <Link
                  href="/technicians?category=ac-repair"
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                >
                  #ACServicing
                </Link>
                <Link
                  href="/technicians?category=cleaning"
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                >
                  #DeepCleaning
                </Link>
              </div>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">CTEVT Verified Pros</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-blue-400">15,000+</p>
                <p className="text-xs text-slate-400 mt-0.5">Completed Repairs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</p>
                <p className="text-xs text-slate-400 mt-0.5">Customer Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">Rs. 0</p>
                <p className="text-xs text-slate-400 mt-0.5">Booking Fee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES GRID */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Explore Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Popular Repair & Maintenance Services
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Select a category to discover rated specialists available near you today.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Browse all 8 categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const IconComponent = categoryIconMap[cat.slug] || Wrench;
              return (
                <Link
                  key={cat.id}
                  href={`/technicians?category=${cat.slug}`}
                  className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description || `Expert certified ${cat.name} technicians for home & business.`}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      {cat._count?.technicians || 0} active pros
                    </span>
                    <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TECHNICIANS */}
      {featuredTechs.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Verified Professionals
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Top-Rated Technicians Near You
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Hand-picked, background-verified master technicians with 4.5+ star reviews.
                </p>
              </div>
              <Link
                href="/technicians"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                View all technicians <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredTechs.map((tech) => (
                <TechnicianCard key={tech.id} technician={tech as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW SAJILO KHOJ WORKS */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">
              How Sajilo Khoj Works
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Fast, reliable repair bookings with zero upfront deposit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 relative hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Search & Compare</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Filter verified plumbers, electricians, or mechanics by location, rating, experience, and clear itemized tariffs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 relative hover:border-teal-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Book Your Slot</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Submit a service request with your preferred time, date, and problem notes. The technician confirms promptly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 relative hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Doorstep Service & Review</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The technician completes the job at your home. Inspect the work, pay directly, and leave a genuine star rating!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COVERAGE ACROSS NEPAL */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Nationwide Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Serving Major Cities Across Nepal
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find on-call technicians ready to arrive at your doorstep in Kathmandu Valley and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((c) => (
              <Link
                key={c.name}
                href={`/technicians?location=${c.name}`}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 aspect-4/3 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 mb-1">
                    {c.tag}
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{c.area}</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-white pt-2 border-t border-white/15">
                    <span>{c.count}</span>
                    <span className="text-blue-400 flex items-center">
                      Search <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE SAJILO KHOJ */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Why Sajilo Khoj
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 leading-tight">
                The Safe & Reliable Way to Hire Local Service Experts
              </h2>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Finding a trustworthy electrician or plumber in Nepal used to involve asking friends or bargaining with random street mechanics. Sajilo Khoj brings transparency, background verification, and honest ratings to your fingertips.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Verified Credentials & CTEVT Badges</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Technicians submit identity documents, trade diplomas, and undergo admin approval.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Upfront Price Transparency</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Clear starting rates and itemized service menus before the pro sets foot in your home.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Fast Response Times</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct booking dispatch ensures technicians confirm their availability rapidly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Real Customer Reviews Only</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Only customers who completed a verified service request can leave a rating.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-4/3">
                <Image
                  src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1000&auto=format&fit=crop&q=80"
                  alt="Technician at work"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    4.9
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {'★'.repeat(5)}
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">Top-Rated Platform</p>
                    <p className="text-[11px] text-slate-500">Based on 1,500+ customer reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Trusted by Homeowners Across Nepal
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Read real stories from customers who booked local repair pros on Sajilo Khoj.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
                    {'★'.repeat(item.rating)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 relative shrink-0">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.location}</p>
                    <span className="text-[10px] font-semibold text-blue-600">
                      {item.service}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BECOME A TECHNICIAN CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-white/20">
            <div className="max-w-2xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase">
                For Service Professionals
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                Are You a Skilled Technician in Nepal?
              </h2>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Join Sajilo Khoj to receive direct service requests from homeowners in your neighborhood. Set your own starting prices, build your verified digital reputation, and grow your daily income.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-300" /> Free Registration
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-300" /> Direct Customer Contact
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-300" /> Fast Admin Verification
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link href="/register/technician">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 text-sm sm:text-base font-bold shadow-xl shadow-slate-950/20"
                >
                  Join as a Service Provider <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Got Questions? We&apos;ve Got Answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <h3 className="font-bold text-slate-900 text-base flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
