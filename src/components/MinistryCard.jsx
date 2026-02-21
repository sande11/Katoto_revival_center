import { motion } from 'framer-motion';

const iconMap = {
  youth: '👥',
  women: '💜',
  men: '👔',
  children: '👶',
  prayer: '🙏',
  outreach: '🌍',
  worship: '🎵',
};

/**
 * Ministry card: icon, name, description, leader, schedule. Optional image.
 */
export default function MinistryCard({ ministry }) {
  const { name, description, leader, schedule, icon, image } = ministry;
  const emoji = iconMap[icon] || '✝️';

  return (
    <motion.article
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {image && (
        <div className="aspect-video overflow-hidden bg-gray-200">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-3xl mb-2" aria-hidden="true">{emoji}</div>
        <h3 className="font-serif text-xl text-royal mb-2">{name}</h3>
        <p className="text-charcoal text-sm mb-4 flex-1">{description}</p>
        <p className="text-royal font-medium text-sm">{leader}</p>
        <p className="text-charcoal/80 text-sm">{schedule}</p>
      </div>
    </motion.article>
  );
}
