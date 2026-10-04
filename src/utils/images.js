/**
 * Images can be stored as "asset:<path in src/assets>" (one of the church's own photos)
 * or as any http(s) image link.
 */
export const ASSET_PREFIX = 'asset:';

const modules = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Every photo in src/assets except the logos, e.g. { key: 'youth-ministry/photo.jpg', folder: 'youth-ministry', url }
export const assetImages = Object.entries(modules)
  .map(([path, url]) => {
    const key = path.replace('../assets/', '');
    const folder = key.includes('/') ? key.split('/')[0] : 'general';
    return { key, folder, url };
  })
  .filter(({ key }) => !key.startsWith('logo-'));

const assetUrls = Object.fromEntries(assetImages.map(({ key, url }) => [key, url]));

/** Turns a stored image value into a URL the browser can load (undefined if it can't). */
export function resolveImage(value) {
  if (!value) return undefined;
  if (value.startsWith(ASSET_PREFIX)) return assetUrls[value.slice(ASSET_PREFIX.length)];
  // Static fallback data imports resolve to Vite's local asset URL.
  if (value.startsWith('/assets/') || value.startsWith('/src/assets/')) return value;
  return /^https?:\/\//i.test(value) ? value : undefined;
}

// Facebook's image links (fbcdn.net) are signed and stop working after a few weeks
export function isExpiringImageLink(value) {
  return /fbcdn\.net|fbsbx\.com/i.test(value || '');
}
