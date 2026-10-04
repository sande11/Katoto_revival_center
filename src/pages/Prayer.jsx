import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../utils/content';
import { supabase } from '../utils/supabase';

export default function Prayer() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    request: '',
    sharePublic: false,
    website: '',
  });
  const [status, setStatus] = useState(null);
  const { data: publicRequests } = useContent('public_prayer_requests');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (!supabase) throw new Error('Prayer request service is not configured.');
      const { error } = await supabase.rpc('submit_prayer_request', {
        p_name: form.name,
        p_email: form.email,
        p_request: form.request,
        p_share_public: form.sharePublic,
        p_website: form.website,
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', request: '', sharePublic: false, website: '' });
    } catch {
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

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-serif text-xl text-royal mb-4">Submit a Prayer Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prayer-name" className="form-label">Name (optional)</label>
                  <input
                    id="prayer-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={120}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="prayer-email" className="form-label">Email (optional)</label>
                  <input
                    id="prayer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={254}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="prayer-request" className="form-label">Prayer request</label>
                  <textarea
                    id="prayer-request"
                    name="request"
                    rows={5}
                    value={form.request}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    className="form-input"
                    placeholder="Share your prayer need..."
                  />
                </div>
                <label className="flex items-start gap-3 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sharePublic"
                    checked={form.sharePublic}
                    onChange={handleChange}
                    className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-gray-300 accent-royal"
                  />
                  <span className="text-sm text-charcoal">
                    Share on the prayer wall so the congregation can pray with me
                    <span className="block text-charcoal/60">Leave unchecked to keep your request private.</span>
                  </span>
                </label>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="prayer-website">Website</label>
                  <input id="prayer-website" name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={handleChange} />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-500 disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : t('cta.submit')}
                </button>
                <div aria-live="polite">
                  {status === 'success' && <p className="text-green-600 text-sm">Thank you. We will pray with you.</p>}
                  {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. You can email your request to us.</p>}
                </div>
              </form>
            </div>

            <div>
              <h3 className="font-serif text-xl text-royal mb-4">Prayer Wall (shared requests)</h3>
              <p className="text-charcoal/80 text-sm mb-4">Join us in praying for these requests.</p>
              <div className="space-y-4">
                {publicRequests.map((pr) => (
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
            className="max-w-2xl mx-auto mt-12 md:mt-16 text-charcoal italic border-l-4 border-gold pl-4 sm:pl-6 py-2"
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
