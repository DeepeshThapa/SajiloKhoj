'use client';

import React from 'react';
import { Filter, RotateCcw, Check, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  category: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  pricePreset?: string;
  minRating?: number;
  minExperience?: number;
  availability: string;
  sortBy: string;
}

interface FilterSidebarProps {
  categories: Array<{ id: string; name: string; slug: string; _count?: { technicians: number } }>;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const pricePresets = [
    { label: 'All Prices', min: undefined, max: undefined, id: 'all' },
    { label: 'Under Rs. 500', min: 0, max: 500, id: 'under_500' },
    { label: 'Rs. 500 – 1,000', min: 500, max: 1000, id: '500_1000' },
    { label: 'Rs. 1,000 – 2,500', min: 1000, max: 2500, id: '1000_2500' },
    { label: 'Rs. 2,500+', min: 2500, max: undefined, id: '2500_plus' },
  ];

  const locations = [
    { label: 'All Cities', value: '' },
    { label: 'Kathmandu', value: 'Kathmandu' },
    { label: 'Lalitpur', value: 'Lalitpur' },
    { label: 'Bhaktapur', value: 'Bhaktapur' },
    { label: 'Pokhara', value: 'Pokhara' },
    { label: 'Chitwan', value: 'Chitwan' },
  ];

  const handlePricePresetClick = (preset: typeof pricePresets[0]) => {
    onFilterChange({
      pricePreset: preset.id,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 divide-y divide-slate-100 shadow-xs space-y-5">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category Section */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Service Category
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: 'all' })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              !filters.category || filters.category === 'all'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {(!filters.category || filters.category === 'all') && (
              <Check className="w-3.5 h-3.5 text-blue-600" />
            )}
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Section */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          City / Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        >
          {locations.map((loc) => (
            <option key={loc.label} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* Starting Price Presets */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Starting Price
        </label>
        <div className="flex flex-wrap gap-1.5">
          {pricePresets.map((preset) => {
            const isSelected = filters.pricePreset === preset.id || (!filters.pricePreset && preset.id === 'all');
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePricePresetClick(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'Any Rating', value: undefined },
            { label: '4.5+ Stars ⭐⭐⭐⭐⭐', value: 4.5 },
            { label: '4.0+ Stars ⭐⭐⭐⭐', value: 4.0 },
            { label: '3.0+ Stars ⭐⭐⭐', value: 3.0 },
          ].map((r) => {
            const isSelected = filters.minRating === r.value;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => onFilterChange({ minRating: r.value })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{r.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Experience Level
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Any Exp', value: undefined },
            { label: '3+ Years', value: 3 },
            { label: '5+ Years', value: 5 },
            { label: '10+ Years', value: 10 },
          ].map((exp) => {
            const isSelected = filters.minExperience === exp.value;
            return (
              <button
                key={exp.label}
                type="button"
                onClick={() => onFilterChange({ minExperience: exp.value })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {exp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Availability
        </label>
        <div className="space-y-1">
          {[
            { label: 'Any Availability', value: 'ALL' },
            { label: 'Available Now', value: 'AVAILABLE_NOW' },
            { label: 'Available Today', value: 'AVAILABLE_TODAY' },
            { label: 'Available This Week', value: 'AVAILABLE_THIS_WEEK' },
          ].map((av) => {
            const isSelected = filters.availability === av.value || (!filters.availability && av.value === 'ALL');
            return (
              <button
                key={av.label}
                type="button"
                onClick={() => onFilterChange({ availability: av.value })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{av.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
