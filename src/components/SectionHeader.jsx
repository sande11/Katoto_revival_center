import { motion } from 'framer-motion';

/**
 * Reusable section heading + optional subtitle for page sections.
 */
export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <motion.div
      className={`text-center max-w-3xl mx-auto mb-10 md:mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-royal mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-charcoal/80 text-base md:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
