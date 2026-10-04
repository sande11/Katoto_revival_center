import { resolveImage } from './images';
import defaultThumbnail from '../assets/miscellenious/556285033_1134227065425775_4024409936295275959_n.jpg';

// Sermon dates follow the church's local day, wherever the visitor is
const CHURCH_TIME_ZONE = 'Africa/Blantyre';

/** Today's date in Malawi as YYYY-MM-DD, matching the sermon date column. */
export function todayISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: CHURCH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** 'live' on the sermon's date, 'past' from the next day, 'upcoming' before it. */
export function sermonStatus(sermon, today = todayISO()) {
  if (sermon.date === today) return 'live';
  return sermon.date < today ? 'past' : 'upcoming';
}

// Dates are plain calendar days, so format in UTC to avoid shifting by a day in other time zones
export function formatSermonDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Date(date).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}

function youtubeId(url) {
  const host = url.hostname.replace(/^(www|m)\./, '');
  if (host === 'youtu.be') return url.pathname.split('/')[1] || null;
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;
  if (url.searchParams.get('v')) return url.searchParams.get('v');
  return url.pathname.match(/^\/(?:live|embed|shorts)\/([\w-]+)/)?.[1] ?? null;
}

/**
 * Reads a YouTube or Facebook video / live stream link.
 * Returns { provider, embedUrl, thumbnail } or null if the link isn't one we can play.
 */
export function parseVideoLink(link) {
  let url;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }

  const id = youtubeId(url);
  if (id) {
    return {
      provider: 'YouTube',
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const host = url.hostname.replace(/^(www|m|web)\./, '');
  if (host === 'facebook.com' || host === 'fb.watch') {
    return {
      provider: 'Facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.href)}&show_text=false`,
      thumbnail: null,
    };
  }

  return null;
}

/** Chosen thumbnail, else the YouTube still, else a church photo. */
export function sermonThumbnail(sermon) {
  return resolveImage(sermon.thumbnail) || parseVideoLink(sermon.link)?.thumbnail || defaultThumbnail;
}
