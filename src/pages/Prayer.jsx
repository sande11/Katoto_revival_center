import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { publicPrayerRequests } from '../data/prayerRequests';

const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_PRAYER = 'your_prayer_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

export default function Prayer() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    request: '',
    sharePublic: false,
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_PRAYER,
        {
          from_name: form.name || 'Anonymous',
          from_email: form.email || '',
          message: form.request,
          share_public: form.sharePublic ? 'Yes' : 'No',
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', request: '', sharePublic: false });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Prayer Requests — Katoto Revival Center</title>
        <meta name="description" content="Submit a prayer request or pray for others at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Prayer Requests"
            subtitle="We believe in the power of prayer. Share your request and we will stand with you."
          />

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-serif text-xl text-royal mb-4">Submit a Prayer Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prayer-name" className="block text-sm font-medium text-charcoal mb-1">Name (optional)</label>
                  <input
                    id="prayer-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="prayer-email" className="block text-sm font-medium text-charcoal mb-1">Email (optional)</label>
                  <input
                    id="prayer-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="prayer-request" className="block text-sm font-medium text-charcoal mb-1">Prayer request</label>
                  <textarea
                    id="prayer-request"
                    name="request"
                    rows={5}
                    value={form.request}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Share your prayer need..."
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sharePublic"
                    checked={form.sharePublic}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-charcoal">Share with congregation (prayer wall) / Keep private</span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-500 disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : t('cta.submit')}
                </button>
                {status === 'success' && <p className="text-green-600 text-sm">Thank you. We will pray with you.</p>}
                {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. You can email your request to us.</p>}
              </form>
            </div>

            <div>
              <h3 className="font-serif text-xl text-royal mb-4">Prayer Wall (shared requests)</h3>
              <p className="text-charcoal/80 text-sm mb-4">Join us in praying for these requests.</p>
              <div className="space-y-4">
                {publicPrayerRequests.map((pr) => (
                  <motion.div
                    key={pr.id}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-charcoal text-sm">{pr.request}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {pr.anonymous ? 'Anonymous' : pr.name} &middot; {new Date(pr.date).toLocaleDateString('en-US')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.blockquote
            className="text-center max-w-2xl mx-auto mt-16 text-charcoal italic border-l-4 border-gold pl-6 py-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            &ldquo;Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective.&rdquo; — James 5:16
          </motion.blockquote>
        </div>
      </section>
    </>
  );
}
