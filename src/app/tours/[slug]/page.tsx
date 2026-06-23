import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl, formatPrice } from '@/lib/strapi';
import { notFound } from 'next/navigation';

interface TourDetail {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  hero_image: { data: { id: number; attributes: { url: string; alternativeText: string | null; width: number; height: number } } | null };
  gallery: { data: { id: number; attributes: { url: string; alternativeText: string | null } }[] };
  duration_days: number;
  price: number | null;
  currency: string;
  start_city: string;
  end_city: string;
  availability: string;
  specific_dates: string;
  is_new: boolean;
  is_waitlist: boolean;
  rating: number | null;
  popularity: number;
  category: { data: { attributes: { name: string; slug: string } } | null };
}

async function getTour(slug: string): Promise<TourDetail | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[0]': 'hero_image',
      'populate[1]': 'gallery',
      'populate[2]': 'category',
    });
    const res = await fetch(`${STRAPI_URL}/api/tours?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data || json.data.length === 0) return null;
    return json.data[0];
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: 'Tour Not Found' };
  return {
    title: `${tour.title} | Tour Website`,
    description: tour.excerpt || `${tour.duration_days}-day tour from ${tour.start_city}`,
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    notFound();
  }

  const heroUrl = getStrapiMediaUrl(tour.hero_image?.data?.attributes?.url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-gray-900">
        <Image
          src={heroUrl}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            {tour.is_new && (
              <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded mb-3">
                New for 2026
              </span>
            )}
            <h1 className="text-4xl font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {tour.duration_days} Days
              </span>
              {tour.price && tour.price > 0 && (
                <span>{formatPrice(tour.price, tour.currency)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Quick info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="font-semibold">{tour.duration_days} Days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Availability</p>
                <p className="font-semibold text-sm">{tour.availability || 'Year-round'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">From</p>
                <p className="font-semibold">{tour.start_city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">To</p>
                <p className="font-semibold">{tour.end_city || tour.start_city}</p>
              </div>
            </div>

            {/* Dates */}
            {tour.specific_dates && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-sm font-medium text-amber-800">
                  Available dates: {tour.specific_dates}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="prose max-w-none text-gray-700">
                {tour.description || tour.excerpt}
              </div>
            </div>

            {/* Gallery */}
            {tour.gallery?.data?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tour.gallery.data.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src={getStrapiMediaUrl(img.attributes.url)}
                        alt={img.attributes.alternativeText || tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {tour.price && tour.price > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {tour.currency === 'CNY' ? '¥' : '$'}{tour.price.toLocaleString()}
                  </p>
                </div>
              )}

              {tour.is_waitlist ? (
                <button className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                  Join the Waitlist
                </button>
              ) : (
                <button className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors">
                  Book This Tour
                </button>
              )}

              <p className="text-xs text-gray-400 text-center mt-3">
                Contact us for more information
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link href="/tours" className="text-emerald-700 hover:text-emerald-800 font-medium">
            &larr; Back to all tours
          </Link>
        </div>
      </div>
    </div>
  );
}
