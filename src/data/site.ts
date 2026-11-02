export const SITE = {
  name: 'Intrepid Luxe',
  tagline: 'Travel perfectly tailored',
  phoneDisplay: '+44 7855 846 789',
  phoneTel: '+447855846789',
  email: 'emilie@intrepidluxe.co.uk',
  formUrl: 'https://www.cognitoforms.com/IntrepidLuxe/IntrepidLuxeTravelRequirements',
};

// Instagram is Emilie's real account. Facebook, TikTok and LinkedIn addresses are not in the brief,
// so those three point at a search for the business until she sends the real addresses.
export const SOCIAL = [
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/intrepid_luxe/' },
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/search/top?q=Intrepid%20Luxe' },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/search?q=Intrepid%20Luxe' },
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/search/results/all/?keywords=Intrepid%20Luxe' },
] as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'The Intrepid Edit', href: '/journal/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Contact', href: '/contact/' },
];

export const FOOTER_NAV = [...NAV.slice(1), { label: 'Privacy policy', href: '/privacy-policy/' }];

export const categorySlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export const CATEGORIES = ['News', 'Destinations', 'Hotels'] as const;

// Photos that have a smaller copy for phones: public/img/<name>-<small>.jpg next to the full-size file.
export const PHOTOS: Record<string, { w: number; h: number; small?: number }> = {
  'hero-beach': { w: 2000, h: 1500, small: 900 },
  'hero-palms-islands': { w: 1320, h: 690, small: 900 },
  'hero-palms-sunset': { w: 2000, h: 1500, small: 900 },
  'harbour-sunset': { w: 1500, h: 2000, small: 900 },
  'pool': { w: 2000, h: 1500, small: 900 },
  'sunset-sea': { w: 2000, h: 1500, small: 900 },
  'emilie-teal': { w: 1125, h: 2000, small: 700 },
  'emilie-jaipur': { w: 1125, h: 2000, small: 700 },
  'pyramids': { w: 1500, h: 2000, small: 700 },
  'balloons': { w: 1500, h: 2000, small: 700 },
  'hawa-mahal': { w: 1147, h: 1735, small: 700 },
  'island': { w: 1500, h: 2000, small: 700 },
};

// Journal dates read the same everywhere, for example "23 October 2026".
export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Prefix a root-relative path with the site's base path (the preview is served from a sub-folder).
export const url = (path: string) => (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '') + path;
