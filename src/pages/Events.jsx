import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import { useContent } from '../utils/content';
import { resolveImage } from '../utils/images';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data: events } = useContent('events');
  const upcoming = events.filter((event) => !event.is_past);
  const past = events.filter((event) => event.is_past);

  return (
    <>
      <Helmet>
        <title>Events — Katoto Revival Center</title>
        <meta name="description" content="Upcoming and past events at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Upcoming Events" subtitle="Join us for these gatherings" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onLearnMore={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Past Events" subtitle="Photos and memories" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {past.map((event) => (
              <motion.button
                key={event.id}
                type="button"
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 focus:ring-2 focus:ring-gold"
                onClick={() => setSelectedEvent({ ...event, past: true })}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {resolveImage(event.image) && <img src={resolveImage(event.image)} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" />}
                <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/70 to-transparent text-left">
                  <span className="text-white text-sm font-medium leading-snug">{event.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
        size="default"
      >
        {selectedEvent && (
          <>
            {selectedEvent.past ? (
              <div>
                <p className="text-charcoal/80 mb-4">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US')}
                </p>
                {resolveImage(selectedEvent.image) && <img src={resolveImage(selectedEvent.image)} alt={selectedEvent.title} className="w-full rounded-lg" />}
              </div>
            ) : (
              <div>
                {resolveImage(selectedEvent.image) && <img src={resolveImage(selectedEvent.image)} alt={selectedEvent.title} className="w-full rounded-lg mb-4" />}
                <p className="text-gold font-medium">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US')} &middot; {selectedEvent.time} &middot; {selectedEvent.location}
                </p>
                <p className="text-charcoal mt-2">{selectedEvent.description}</p>
                {(selectedEvent.rsvpLink ?? selectedEvent.rsvp_link) && (
                  <Link
                    to={selectedEvent.rsvpLink ?? selectedEvent.rsvp_link}
                    className="block sm:inline-block text-center mt-4 bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold-500 transition-colors"
                  >
                    RSVP
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
