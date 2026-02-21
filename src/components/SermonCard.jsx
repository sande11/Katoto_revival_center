import { motion } from 'framer-motion';

/**
 * Sermon card: thumbnail, title, speaker, date, series, Watch/Listen button.
 * onWatch opens modal or detail with YouTube embed.
 */
export default function SermonCard({ sermon, onWatch }) {
  const { title, speaker, date, series, thumbnail } = sermon;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
      >
        <div className="aspect-video overflow-hidden bg-gray-200 relative group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-gold text-white font-semibold px-4 py-2 rounded-lg">
              Watch
            </span>
          </div>
        </div>
      </button>
      <div className="p-4">
        <p className="text-gold font-medium text-sm mb-1">{series}</p>
        <h3 className="font-serif text-lg text-royal mb-1">{title}</h3>
        <p className="text-charcoal/80 text-sm mb-2">{speaker} &middot; {formattedDate}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatch(sermon);
          }}
          className="text-royal font-medium hover:underline"
        >
          Watch
        </button>
      </div>
    </motion.article>
  );
}
