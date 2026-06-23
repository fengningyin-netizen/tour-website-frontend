// Types for Strapi API responses
export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  url: string;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: StrapiImage;
  } | null;
}

export interface StrapiMediaArray {
  data: {
    id: number;
    attributes: StrapiImage;
  }[];
}

export interface TourCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Tour {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  hero_image: StrapiMedia;
  gallery: StrapiMediaArray;
  duration_days: number;
  price: number | null;
  currency: 'USD' | 'CNY';
  start_city: string;
  end_city: string;
  availability: string;
  specific_dates: string;
  is_new: boolean;
  is_waitlist: boolean;
  rating: number | null;
  popularity: number;
  publishedAt: string;
  category: { data: { id: number; attributes: TourCategory } | null };
  type: { data: { id: number; attributes: TourCategory } | null };
}

export interface StrapiResponse<T> {
  data: {
    id: number;
    documentId: string;
    [key: string]: unknown;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    documentId: string;
    [key: string]: unknown;
  };
  meta: Record<string, unknown>;
}
