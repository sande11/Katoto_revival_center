import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Card for event listing: image, title, date, time, location, description, RSVP link.
 */
export default function EventCard({ event, onLearnMore }) {
  const { title, date, time, location, description, image, rsvpLink } = event;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.article
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="aspect-video overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <p className="text-gold font-medium text-sm mb-1">{formattedDate}</p>
        <h3 className="font-serif text-lg sm:text-xl text-royal mb-2">{title}</h3>
        <p className="text-charcoal/80 text-sm mb-2">
          {time} &middot; {location}
        </p>
        <p className="text-charcoal text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex gap-3 mt-auto">
          {onLearnMore && (
            <button
              type="button"
              onClick={() => onLearnMore(event)}
              className="flex-1 sm:flex-none border-2 border-royal text-royal font-semibold px-4 py-2 rounded-lg hover:bg-royal/5 transition-colors text-sm"
            >
              Learn More
            </button>
          )}
          {rsvpLink && (
            <Link
              to={rsvpLink}
              className="flex-1 sm:flex-none text-center bg-gold text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-500 transition-colors text-sm"
            >
              RSVP
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
