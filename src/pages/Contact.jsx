import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import SectionHeader from '../components/SectionHeader';
import { churchContact } from '../data/contact';

// EmailJS: replace with your own service ID, template ID, and public key in production
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

const quickActions = [
  {
    label: 'Call',
    href: `tel:${churchContact.phone}`,
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
  {
    label: 'WhatsApp',
    href: churchContact.whatsappUrl,
    external: true,
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    label: 'Email',
    href: `mailto:${churchContact.email}`,
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'Directions',
    href: churchContact.directionsUrl,
    external: true,
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formState.name,
          from_email: formState.email,
          phone: formState.phone,
          message: formState.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFormState({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      console.error('EmailJS error:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact — Katoto Revival Center</title>
        <meta name="description" content="Get in touch with Katoto Revival Center. Visit, call, or send a message." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Contact Us" subtitle="We would love to hear from you" />

          {/* DOM order is info → form → map so phones get the one-tap actions first;
              on desktop the form sits on the left spanning both rows */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-x-12 lg:gap-y-6 max-w-5xl mx-auto">
            <div className="lg:col-start-2 lg:row-start-1">
              <h3 className="font-serif text-xl text-royal mb-4">Church Info</h3>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                {quickActions.map(({ label, href, external, icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-white border border-gray-200 text-royal text-xs sm:text-sm font-medium hover:border-gold hover:text-gold active:bg-gray-50 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                    {label}
                  </a>
                ))}
              </div>

              <ul className="space-y-3 text-charcoal mb-6">
                <li><strong>Address:</strong> {churchContact.address}</li>
                <li>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${churchContact.email}`} className="text-royal underline underline-offset-2 break-all hover:text-gold">
                    {churchContact.email}
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${churchContact.phone}`} className="text-royal underline underline-offset-2 whitespace-nowrap hover:text-gold">
                    {churchContact.phoneDisplay}
                  </a>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <a href={churchContact.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-full border border-gray-300 text-sm text-royal hover:border-gold hover:text-gold transition-colors">Facebook</a>
                <a href={churchContact.youtubeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-full border border-gray-300 text-sm text-royal hover:border-gold hover:text-gold transition-colors">YouTube</a>
                <a href={churchContact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-full border border-gray-300 text-sm text-royal hover:border-gold hover:text-gold transition-colors">WhatsApp</a>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md border border-gray-100 lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <h3 className="font-serif text-xl text-royal mb-4">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="form-label">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="form-label">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="form-label">Phone <span className="text-charcoal/60 font-normal">(optional)</span></label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : t('cta.send')}
                </button>
                <div aria-live="polite">
                  {status === 'success' && <p className="text-green-600 text-sm">Message sent. We will get back to you soon.</p>}
                  {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. You can email us directly at {churchContact.email}</p>}
                </div>
              </form>
            </div>

            <div className="lg:col-start-2 lg:row-start-2 rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] sm:aspect-video bg-gray-200">
              <iframe
                title="Church location"
                src={churchContact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
