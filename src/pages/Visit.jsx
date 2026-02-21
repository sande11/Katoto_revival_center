import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';

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

          <div className="max-w-3xl mx-auto space-y-12">
            <motion.section
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-serif text-xl text-royal mb-4">Service Times</h3>
              <ul className="space-y-2 text-charcoal">
                <li><strong>Sunday Worship</strong> — 9:00 AM</li>
                <li><strong>Midweek Prayer</strong> — Wednesday 5:30 PM</li>
                <li><strong>Youth Night</strong> — Friday 6:00 PM</li>
                <li><strong>Women's Fellowship</strong> — First Saturday, 8:00 AM</li>
                <li><strong>Men's Fellowship</strong> — Second Saturday, 7:00 AM</li>
              </ul>
            </motion.section>

            <section>
              <h3 className="font-serif text-xl text-royal mb-4">What to Expect</h3>
              <div className="space-y-4">
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

            <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-serif text-xl text-royal mb-2">Dress Code & Parking</h3>
              <p className="text-charcoal mb-4">
                We have no strict dress code. Come in what is comfortable for you. Parking is available on-site; our team will help you find a spot.
              </p>
              <p className="text-charcoal">
                <strong>Address:</strong> Katoto, Nairobi, Kenya. Use the map below for directions.
              </p>
            </section>

            <section className="rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-200">
              <iframe
                title="Church location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814239762386!2d36.8214!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTczMTEuNiJTIDM2wrA0OTMxNy4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </section>

            <section>
              <h3 className="font-serif text-xl text-royal mb-4">First-Time Visitor FAQ</h3>
              <div className="space-y-2">
                {visitFaqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-3 font-medium text-royal flex justify-between"
                    >
                      {faq.q}
                      <span>{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && <div className="px-4 pb-3 text-charcoal text-sm">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>

            <div className="text-center">
              <Link to="/contact" className="inline-block bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold-500">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
