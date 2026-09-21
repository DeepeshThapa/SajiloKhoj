'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import { TechnicianCard } from '@/components/technician/TechnicianCard';
import { FilterSidebar, FilterState } from '@/components/search/FilterSidebar';
import { MobileFilterDrawer } from '@/components/search/MobileFilterDrawer';
import { RequestServiceModal } from '@/components/technician/RequestServiceModal';
import { Button } from '@/components/ui/Button';
import { getTechnicians } from '@/lib/actions/technicians';
import { getCategories } from '@/lib/actions/categories';

export default function TechniciansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL state
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const locationParam = searchParams.get('location') || '';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const pricePresetParam = searchParams.get('pricePreset') || 'all';
  const minRatingParam = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
  const minExpParam = searchParams.get('minExp') ? Number(searchParams.get('minExp')) : undefined;
  const availabilityParam = searchParams.get('availability') || 'ALL';
  const sortByParam = searchParams.get('sortBy') || 'recommended';
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // Local state
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam,
    location: locationParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    pricePreset: pricePresetParam,
    minRating: minRatingParam,
    minExperience: minExpParam,
    availability: availabilityParam,
    sortBy: sortByParam,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Booking modal state
  const [bookingTech, setBookingTech] = useState<any>(null);

  // Fetch categories once
  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  // Fetch technicians whenever URL params change
  const fetchTechnicians = async () => {
    setIsLoading(true);
    const res = await getTechnicians({
      query: queryParam,
      category: categoryParam === 'all' ? undefined : categoryParam,
      location: locationParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      minRating: minRatingParam,
      minExperience: minExpParam,
      availability: availabilityParam === 'ALL' ? undefined : availabilityParam,
      sortBy: sortByParam as any,
      page: pageParam,
      limit: 9,
    });
    setIsLoading(false);

    if (res.success && res.data) {
      setTechnicians(res.data);
      setPagination(res.pagination || { total: 0, page: 1, limit: 9, totalPages: 1 });
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [searchParams]);

  // Update URL helper
  const updateUrl = (updated: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updated).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '' || val === 'all' || val === 'ALL') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    if (!updated.page) {
      params.delete('page'); // Reset to page 1 on filter change
    }

    startTransition(() => {
      router.push(`/technicians?${params.toString()}`);
    });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    updateUrl({
      ...filters,
      ...newFilters,
      minExp: newFilters.minExperience !== undefined ? newFilters.minExperience : filters.minExperience,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ query: searchQuery });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      location: '',
      minPrice: undefined,
      maxPrice: undefined,
      pricePreset: 'all',
      minRating: undefined,
      minExperience: undefined,
      availability: 'ALL',
      sortBy: 'recommended',
    });
    startTransition(() => {
      router.push('/technicians');
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Find Local Technicians
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing{' '}
                <span className="font-bold text-slate-900">{pagination.total}</span> verified
                specialists across Nepal
              </p>
            </div>

            {/* Sort & Mobile Filter Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
                  Sort By:
                </span>
                <select
                  value={sortByParam}
                  onChange={(e) => updateUrl({ sortBy: e.target.value })}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                  <option value="newest">Newest Joined</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Query Input Bar */}
          <div className="mt-6">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, technician name, or problem (e.g. leaking sink, inverter wiring)..."
                  className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <Button type="submit" size="sm" variant="primary">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Technicians Listing */}
          <div className="lg:col-span-3">
            {isLoading || isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-8 bg-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : technicians.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No Technicians Found
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  We couldn&apos;t find any verified technicians matching your current filter criteria. Try adjusting the category, location, or price filters.
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset All Filters
                </Button>
              </div>
            ) : (
              /* Results Grid */
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {technicians.map((tech) => (
                    <TechnicianCard
                      key={tech.id}
                      technician={tech}
                      onRequestClick={(t) => setBookingTech(t)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => updateUrl({ page: pagination.page - 1 })}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === pagination.page;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateUrl({ page: pageNum })}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => updateUrl({ page: pagination.page + 1 })}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={pagination.total}
      />

      {/* Booking Modal */}
      {bookingTech && (
        <RequestServiceModal
          isOpen={!!bookingTech}
          onClose={() => setBookingTech(null)}
          technician={bookingTech}
        />
      )}
    </div>
  );
}
