import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/types/tour';
import { getStrapiMediaUrl, formatPrice } from '@/lib/strapi';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const attrs = tour;
  const imgUrl = getStrapiMediaUrl(attrs.hero_image?.data?.attributes?.url);

  return (
    <Link
      href={`/tours/${attrs.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imgUrl}
          alt={attrs.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {attrs.is_new && (
            <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded">
              New for 2026
            </span>
          )}
          {attrs.is_waitlist && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded">
              Join the Waitlist
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {attrs.title}
        </h3>

        {/* Price */}
        {attrs.price && attrs.price > 0 && (
          <p className="text-emerald-700 font-semibold text-sm mb-2">
            {formatPrice(attrs.price, attrs.currency)}
          </p>
        )}

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{attrs.duration_days} Days</span>
        </div>

        {/* Availability */}
        {attrs.availability && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Availability: {attrs.availability}</span>
          </div>
        )}

        {/* Route */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {attrs.start_city}
            {attrs.end_city && attrs.end_city !== attrs.start_city && ` → ${attrs.end_city}`}
          </span>
        </div>

        {/* Excerpt */}
        {attrs.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2">{attrs.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
