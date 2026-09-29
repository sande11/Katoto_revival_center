import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import Lightbox from '../components/Lightbox';
import { galleryImages, galleryCategories } from '../data/gallery';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return galleryImages;
    return galleryImages.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Helmet>
        <title>Gallery — Katoto Revival Center</title>
        <meta name="description" content="Photos from services, events, outreach, and youth at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Gallery" subtitle="Moments from our church life" />

          {/* Single swipeable row of filters on phones, centered wrap from sm */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-6 sm:mb-10 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-royal text-white'
                    : 'bg-white text-charcoal border border-gray-300 hover:border-royal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            <AnimatePresence mode="wait">
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  type="button"
                  className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-200 focus:ring-2 focus:ring-gold"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View ${img.title}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </>
  );
}
