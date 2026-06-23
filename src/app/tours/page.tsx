import { Suspense } from 'react';
import TourCard from '@/components/TourCard';
import SearchFilters from '@/components/SearchFilters';
import SortToolbar from '@/components/SortToolbar';
import type { Tour } from '@/types/tour';

async function getTours(searchParams: Record<string, string>) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const page = parseInt(searchParams.page || '1');
  const pageSize = 9;
  const sort = searchParams.sort || 'publishedAt';
  const order = searchParams.order || 'desc';

  // Build filters
  const filters: Record<string, unknown> = {};
  if (searchParams.keywords) {
    filters.$or = [
      { title: { $containsi: searchParams.keywords } },
      { excerpt: { $containsi: searchParams.keywords } },
      { start_city: { $containsi: searchParams.keywords } },
    ];
  }
  if (searchParams.category) {
    filters.category = { slug: { $eq: searchParams.category } };
  }
  if (searchParams.type) {
    filters.type = { slug: { $eq: searchParams.type } };
  }

  const params = new URLSearchParams({
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'sort[0]': `${sort}:${order}`,
    'populate[0]': 'hero_image',
    'populate[1]': 'category',
    'populate[2]': 'type',
  });

  if (Object.keys(filters).length > 0) {
    params.set('filters', JSON.stringify(filters));
  }

  const url = `${STRAPI_URL}/api/tours?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [], meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } } };
    return res.json();
  } catch {
    return { data: [], meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } } };
  }
}

async function getCategories() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?pagination[pageSize]=100`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((item: { id: number; documentId: string; name: string; slug: string }) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [toursData, categories, types] = await Promise.all([
    getTours(params),
    getCategories(),
    [], // Types can be added later
  ]);

  const tours = toursData.data || [];
  const total = toursData.meta?.pagination?.total || 0;
  const page = toursData.meta?.pagination?.page || 1;
  const pageSize = toursData.meta?.pagination?.pageSize || 9;
  const pageCount = toursData.meta?.pagination?.pageCount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Search Tours</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Filters */}
        <Suspense fallback={<div className="h-24 bg-white rounded-lg animate-pulse" />}>
          <SearchFilters categories={categories} types={types} />
        </Suspense>

        {/* Sort Toolbar */}
        <Suspense fallback={<div className="h-10 animate-pulse" />}>
          <SortToolbar total={total} page={page} pageSize={pageSize} />
        </Suspense>

        {/* Tour Grid */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour: Tour) => (
              <TourCard key={tour.documentId} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg text-gray-500">No tours found</h3>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters</p>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/tours?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
