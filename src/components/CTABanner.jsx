import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Reusable call-to-action banner (e.g. "New Here? We'd love to meet you").
 */
export default function CTABanner({ title, subtitle, buttonText, to = '/visit', className = '' }) {
  return (
    <motion.section
      className={`bg-royal text-white py-12 md:py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">{title}</h2>
        {subtitle && <p className="text-white/90 mb-6 max-w-xl mx-auto">{subtitle}</p>}
        <Link
          to={to}
          className="inline-block bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold-500 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </motion.section>
  );
}
