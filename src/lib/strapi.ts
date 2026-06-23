import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface FetchOptions extends RequestInit {
  params?: Record<string, unknown>;
}

export async function fetchAPI<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const { params, ...fetchOptions } = options || {};

  let url = `${STRAPI_URL}/api${endpoint}`;
  if (params) {
    const queryString = qs.stringify(params, { encodeValuesOnly: true });
    url += `?${queryString}`;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...fetchOptions,
  } as RequestInit & { next?: { revalidate?: number } });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// Helper to format price
export function formatPrice(price: number | null, currency: string = 'USD'): string {
  if (price === null || price === 0) return '';
  const symbol = currency === 'CNY' ? '¥' : '$';
  return `From ${symbol}${price.toLocaleString()}`;
}
