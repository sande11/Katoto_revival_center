import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import SectionHeader from '../components/SectionHeader';

// EmailJS: replace with your own service ID, template ID, and public key in production
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

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

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-serif text-xl text-royal mb-4">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal mb-1">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-charcoal mb-1">Phone</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal mb-1">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : t('cta.send')}
                </button>
                {status === 'success' && <p className="text-green-600 text-sm">Message sent. We will get back to you soon.</p>}
                {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. You can email us directly at info@katotorevivalcenter.org</p>}
              </form>
            </div>

            <div>
              <h3 className="font-serif text-xl text-royal mb-4">Church Info</h3>
              <ul className="space-y-3 text-charcoal mb-6">
                <li><strong>Address:</strong> Katoto, Nairobi, Kenya</li>
                <li><strong>Email:</strong> info@katotorevivalcenter.org</li>
                <li><strong>Phone:</strong> +254 700 000 000</li>
              </ul>
              <div className="flex gap-4 mb-6">
                <a href="https://www.facebook.com/katotorevivalcenter" target="_blank" rel="noopener noreferrer" className="text-royal hover:text-gold">Facebook</a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-royal hover:text-gold">YouTube</a>
                <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="text-royal hover:text-gold">WhatsApp</a>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-200">
                <iframe
                  title="Church location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814239762386!2d36.8214!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTczMTEuNiJTIDM2wrA0OTMxNy4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
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
        </div>
      </section>
    </>
  );
}
