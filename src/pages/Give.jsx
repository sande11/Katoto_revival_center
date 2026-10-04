import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../utils/content';

const faqs = [
  { q: 'Why do we give?', a: 'We give in response to God\'s grace and to support the work of the church—ministry, facilities, outreach, and missions. Giving is an act of worship and trust.' },
  { q: 'Is online giving secure?', a: 'Yes. We use secure payment processing. Your information is protected and we do not store full card details.' },
  { q: 'Can I give in person?', a: 'Yes. You can give during services via the offering or at the church office during the week.' },
];

export default function Give() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { data: methods } = useContent('giving_methods');
  const banks = methods.filter((method) => method.kind === 'bank').map((method) => ({ bank: method.provider, accountName: method.label, accountNumber: method.value }));
  const mobile = methods.filter((method) => method.kind === 'mobile').map((method) => ({ provider: method.provider, label: method.label, value: method.value }));

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

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="font-serif text-xl text-royal mb-4">Give Now</h3>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Bank Transfer</h4>
                <div className="space-y-3 mb-6">
                  {banks.map((acc) => (
                    <div key={`${acc.bank}-${acc.accountNumber}`} className="rounded-lg border border-gray-200 p-4">
                      <p className="font-semibold text-royal mb-2">{acc.bank}</p>
                      <dl className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <dt className="text-xs text-gray-500">Account name</dt>
                          <dd className="font-medium text-charcoal">{acc.accountName}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Account number</dt>
                          <dd className="text-lg font-semibold text-charcoal tabular-nums">{acc.accountNumber}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Mobile Money</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {mobile.map((m) => (
                    <div key={m.provider} className="rounded-lg border border-gray-200 p-4">
                      <p className="font-semibold text-royal mb-2">{m.provider}</p>
                      <dl>
                        <dt className="text-xs text-gray-500">{m.label}</dt>
                        <dd className="text-lg font-semibold text-charcoal tabular-nums">{m.value}</dd>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100"
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
                className="bg-royal/5 border border-royal/20 p-5 sm:p-6 rounded-xl"
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

          <div className="max-w-2xl mx-auto mt-10 md:mt-12">
            <h3 className="font-serif text-xl text-royal mb-4 text-center">Giving FAQ</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    aria-expanded={expandedFaq === i}
                    className="w-full text-left px-4 py-3.5 font-medium text-royal flex justify-between items-center gap-4"
                  >
                    {faq.q}
                    <span className="flex-shrink-0 text-xl leading-none" aria-hidden="true">{expandedFaq === i ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-charcoal text-sm">{faq.a}</div>
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
