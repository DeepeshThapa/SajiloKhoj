'use client';

import React from 'react';
import { X, Filter } from 'lucide-react';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { Button } from '@/components/ui/Button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; slug: string; _count?: { technicians: number } }>;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Filter Technicians ({totalResults})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onReset}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <Button variant="outline" className="flex-1" onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" className="flex-1" onClick={onClose}>
            Show {totalResults} Results
          </Button>
        </div>
      </div>
    </div>
  );
}
