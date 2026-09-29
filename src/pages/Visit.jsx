import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { churchContact } from '../data/contact';

const serviceTimes = [
  { name: 'Sunday Worship', time: 'Sunday 9:00 AM' },
  { name: 'Midweek Prayer', time: 'Wednesday 5:30 PM' },
  { name: 'Youth Night', time: 'Friday 6:00 PM' },
  { name: "Women's Fellowship", time: 'First Saturday, 8:00 AM' },
  { name: "Men's Fellowship", time: 'Second Saturday, 7:00 AM' },
];

const steps = [
  { n: 1, title: 'Park & Enter', text: 'Park in the designated area. Greeters will welcome you at the door and direct you.' },
  { n: 2, title: 'Get Comfortable', text: 'Sit anywhere you like. Bulletins and connection cards are available.' },
  { n: 3, title: 'Worship & Word', text: 'We start with praise and worship, then hear a message from the Bible.' },
  { n: 4, title: 'Connect', text: 'After service, visit the welcome desk or fill a connection card so we can stay in touch.' },
];

const visitFaqs = [
  { q: 'What time does service start?', a: 'Sunday worship begins at 9:00 AM. We recommend arriving a few minutes early.' },
  { q: 'What should I wear?', a: 'Come as you are. Most people dress smart-casual; some wear traditional attire. All are welcome.' },
  { q: 'Is there something for my kids?', a: 'Yes. We have a vibrant Children\'s Ministry during the service. Check-in is available at the entrance.' },
  { q: 'How long is the service?', a: 'Typically about 2 hours, including worship, the Word, and ministry time.' },
];

export default function Visit() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Helmet>
        <title>Plan Your Visit — Katoto Revival Center</title>
        <meta name="description" content="Service times, what to expect, dress code, parking, and directions to Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Plan Your Visit" subtitle="We can't wait to meet you" />

          <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
            <motion.section
              className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-serif text-xl text-royal mb-2">Service Times</h3>
              <ul className="divide-y divide-gray-100 text-charcoal">
                {serviceTimes.map(({ name, time }) => (
                  <li key={name} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-0.5 py-3">
                    <strong className="font-semibold">{name}</strong>
                    <span className="text-charcoal/80 text-sm sm:text-base sm:text-right">{time}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <section>
              <h3 className="font-serif text-xl text-royal mb-4">What to Expect</h3>
              <div className="space-y-3 sm:space-y-4">
                {steps.map((step) => (
                  <motion.div
                    key={step.n}
                    className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gold text-white font-bold flex items-center justify-center">{step.n}</span>
                    <div>
                      <h4 className="font-semibold text-royal">{step.title}</h4>
                      <p className="text-charcoal text-sm">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-serif text-xl text-royal mb-2">Dress Code & Parking</h3>
              <p className="text-charcoal mb-4">
                We have no strict dress code. Come in what is comfortable for you. Parking is available on-site; our team will help you find a spot.
              </p>
              <p className="text-charcoal">
                <strong>Address:</strong> {churchContact.address}. Use the map below for directions.
              </p>
            </section>

            <section>
              <div className="rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] sm:aspect-video bg-gray-200">
                <iframe
                  title="Church location"
                  src={churchContact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <a
                href={churchContact.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex sm:inline-flex items-center justify-center gap-2 w-full sm:w-auto border-2 border-royal text-royal font-semibold px-6 py-2.5 rounded-lg hover:bg-royal/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Directions
              </a>
            </section>

            <section>
              <h3 className="font-serif text-xl text-royal mb-4">First-Time Visitor FAQ</h3>
              <div className="space-y-2">
                {visitFaqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="w-full text-left px-4 py-3.5 font-medium text-royal flex justify-between items-center gap-4"
                    >
                      {faq.q}
                      <span className="flex-shrink-0 text-xl leading-none" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && <div className="px-4 pb-4 text-charcoal text-sm">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>

            <div className="text-center">
              <Link to="/contact" className="block sm:inline-block bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold-500 transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
