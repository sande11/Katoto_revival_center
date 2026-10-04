import { motion } from 'framer-motion';
import { formatSermonDate, sermonThumbnail } from '../utils/sermons';

/**
 * Sermon card: thumbnail, title, speaker, date, series, Watch/Listen button.
 * onWatch opens modal or detail with the YouTube / Facebook embed.
 */
export default function SermonCard({ sermon, onWatch }) {
  const { title, speaker, date, series } = sermon;
  const thumbnail = sermonThumbnail(sermon);
  const formattedDate = formatSermonDate(date);

  return (
    <motion.article
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => onWatch(sermon)}
        aria-label={`Watch ${title}`}
      >
        <div className="aspect-video overflow-hidden bg-gray-200 relative group">
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Play badge is always visible on touch screens; on desktop it brightens on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <span className="w-14 h-14 rounded-full bg-gold/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>
      </button>
      <div className="p-4">
        <p className="text-gold font-medium text-sm mb-1">{series}</p>
        <h3 className="font-serif text-lg text-royal mb-1">{title}</h3>
        <p className="text-charcoal/80 text-sm">{speaker} &middot; {formattedDate}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatch(sermon);
          }}
          className="inline-flex items-center gap-1 py-2 text-royal font-medium hover:underline"
        >
          Watch →
        </button>
      </div>
    </motion.article>
  );
}
