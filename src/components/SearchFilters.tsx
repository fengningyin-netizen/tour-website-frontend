'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

interface SearchFiltersProps {
  categories: Category[];
  types: Category[];
}

export default function SearchFilters({ categories, types }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keywords, setKeywords] = useState(searchParams.get('keywords') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (keywords) params.set('keywords', keywords);
    if (category) params.set('category', category);
    if (type) params.set('type', type);
    // Preserve sort params
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/tours?${params.toString()}`);
  }, [keywords, category, type, searchParams, router]);

  const clearFilters = () => {
    setKeywords('');
    setCategory('');
    setType('');
    router.push('/tours');
  };

  const hasFilters = keywords || category || type;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <div className="relative">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search tours..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
          >
            <option value="">Any</option>
            {categories.map((cat) => (
              <option key={cat.documentId} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
          >
            <option value="">Any</option>
            {types.map((t) => (
              <option key={t.documentId} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="flex-1 bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors text-sm font-semibold"
          >
            SEARCH
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm underline whitespace-nowrap"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
