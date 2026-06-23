'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortToolbarProps {
  total: number;
  page: number;
  pageSize: number;
}

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Release Date' },
  { value: 'specific_dates', label: 'Tour Date' },
  { value: 'title', label: 'Title' },
  { value: 'price', label: 'Price' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'duration_days', label: 'Duration' },
];

export default function SortToolbar({ total, page, pageSize }: SortToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'publishedAt';
  const currentOrder = searchParams.get('order') || 'desc';

  const updateSort = (sort: string, order: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('order', order);
    params.set('page', '1');
    router.push(`/tours?${params.toString()}`);
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Sort */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Sort by</span>
        <select
          value={currentSort}
          onChange={(e) => updateSort(e.target.value, currentOrder)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={currentOrder}
          onChange={(e) => updateSort(currentSort, e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {total} tours
      </p>
    </div>
  );
}
