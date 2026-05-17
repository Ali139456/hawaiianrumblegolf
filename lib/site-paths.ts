/** Section ids on the home page — use with {@link homeHash} from any route. */
export const HOME_SECTIONS = {
  rates: "rates",
  gallery: "gallery",
  testimonials: "testimonials",
  texasMovieShop: "texas-movie-shop",
  contact: "contact",
  experience: "experience",
} as const;

export type HomeSection = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS];

/** Absolute home URL with hash, e.g. `/#rates` (works from `/deals` and other routes). */
export function homeHash(section: HomeSection | string): string {
  const id = section.startsWith("#") ? section.slice(1) : section;
  return `/#${id}`;
}

/** Normalize `#foo` to `/#foo`; leave `http`, `tel:`, and absolute paths unchanged. */
export function normalizeSiteHref(href: string): string {
  if (/^(https?:\/\/|tel:|mailto:)/i.test(href)) return href;
  if (href.startsWith("/#")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
}
