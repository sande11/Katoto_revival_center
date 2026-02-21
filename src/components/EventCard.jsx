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
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
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
        />
      </div>
      <div className="p-5">
        <p className="text-gold font-medium text-sm mb-1">{formattedDate}</p>
        <h3 className="font-serif text-xl text-royal mb-2">{title}</h3>
        <p className="text-charcoal/80 text-sm mb-2">
          {time} &middot; {location}
        </p>
        <p className="text-charcoal text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex gap-3">
          {onLearnMore && (
            <button
              type="button"
              onClick={() => onLearnMore(event)}
              className="text-royal font-medium hover:underline"
            >
              Learn More
            </button>
          )}
          {rsvpLink && (
            <Link
              to={rsvpLink}
              className="bg-gold text-white font-semibold px-4 py-2 rounded-lg hover:bg-gold-500 transition-colors text-sm"
            >
              RSVP
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
