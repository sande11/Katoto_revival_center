import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';
import { galleryImages, galleryCategories } from '../data/gallery';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

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

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-royal text-white'
                    : 'bg-white text-charcoal border border-gray-300 hover:border-royal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {filtered.map((img) => (
                <motion.button
                  key={img.id}
                  type="button"
                  className="aspect-square rounded-xl overflow-hidden bg-gray-200 focus:ring-2 focus:ring-gold"
                  onClick={() => setLightboxImage(img)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        title={lightboxImage?.title}
        size="large"
      >
        {lightboxImage && (
          <img
            src={lightboxImage.src}
            alt={lightboxImage.title}
            className="w-full rounded-lg"
          />
        )}
      </Modal>
    </>
  );
}
