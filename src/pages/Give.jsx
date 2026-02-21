import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';

const givingTypes = [
  { id: 'tithe', label: 'Tithe & Offering' },
  { id: 'building', label: 'Building Fund' },
  { id: 'missions', label: 'Missions' },
  { id: 'other', label: 'Other' },
];

const faqs = [
  { q: 'Why do we give?', a: 'We give in response to God\'s grace and to support the work of the church—ministry, facilities, outreach, and missions. Giving is an act of worship and trust.' },
  { q: 'Is online giving secure?', a: 'Yes. We use secure payment processing. Your information is protected and we do not store full card details.' },
  { q: 'Can I give in person?', a: 'Yes. You can give during services via the offering or at the church office during the week.' },
];

export default function Give() {
  const { t: T } = useTranslation();
  const [amount, setAmount] = useState('');
  const [givingType, setGivingType] = useState('tithe');
  const [name, setName] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: in production, integrate Flutterwave or other gateway
    alert('Thank you for your heart to give. Payment integration can be connected here (e.g. Flutterwave).');
  };

  return (
    <>
      <Helmet>
        <title>Give — Katoto Revival Center</title>
        <meta name="description" content="Give tithes, offerings, and support the building fund at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Give"
            subtitle="Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. — 2 Corinthians 9:7"
          />

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="font-serif text-xl text-royal mb-4">Give Now</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="give-name" className="block text-sm font-medium text-charcoal mb-1">Name (optional)</label>
                    <input
                      id="give-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="give-amount" className="block text-sm font-medium text-charcoal mb-1">Amount (KES)</label>
                    <input
                      id="give-amount"
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="give-type" className="block text-sm font-medium text-charcoal mb-1">Giving type</label>
                    <select
                      id="give-type"
                      value={givingType}
                      onChange={(e) => setGivingType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      {givingTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-500 transition-colors"
                  >
                    {T('cta.giveNow')}
                  </button>
                </form>
                <p className="text-gray-500 text-sm mt-4">
                  Payment gateway (e.g. Flutterwave) can be integrated here for real transactions.
                </p>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h3 className="font-serif text-xl text-royal mb-3">Ways to Give</h3>
                <ul className="space-y-2 text-charcoal">
                  <li><strong>Tithe & Offering</strong> — Regular worship giving</li>
                  <li><strong>Building Fund</strong> — For facilities and expansion</li>
                  <li><strong>Missions</strong> — Supporting outreach and missionaries</li>
                </ul>
              </motion.div>

              <motion.div
                className="bg-royal/5 border border-royal/20 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h3 className="font-serif text-lg text-royal mb-2">Why We Give</h3>
                <p className="text-charcoal text-sm">
                  We give to honor God, fund ministry, care for our community, and spread the Gospel. Every gift matters and is used with accountability and prayer.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="font-serif text-xl text-royal mb-4 text-center">Giving FAQ</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 font-medium text-royal flex justify-between items-center"
                  >
                    {faq.q}
                    <span className="text-xl">{expandedFaq === i ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3 text-charcoal text-sm">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
