import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SWIPE_THRESHOLD = 60;

/**
 * Full-screen image viewer. Swipe or use the arrows / arrow keys to move between images.
 * `images` is an array of { src, title }; `index` is the open image (null when closed).
 */
export default function Lightbox({ images, index, onClose, onChange }) {
  const isOpen = index !== null && images[index];
  const count = images.length;
  const goPrev = () => onChange((index - 1 + count) % count);
  const goNext = () => onChange((index + 1) % count);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count);
      if (e.key === 'ArrowRight') onChange((index + 1) % count);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, index, count, onClose, onChange]);

  const image = isOpen ? images[index] : null;

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between gap-3 pl-4 pr-2 py-2 text-white">
            <div className="min-w-0">
              <p className="font-serif text-lg truncate">{image.title}</p>
              <p className="text-white/60 text-sm">{index + 1} / {count}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center overflow-hidden px-2 sm:px-16" onClick={onClose}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={image.src + index}
                src={image.src}
                alt={image.title}
                className="max-h-full max-w-full object-contain rounded-lg select-none touch-pan-y"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) goNext();
                  else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 sm:bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 sm:bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <p className="text-center text-white/50 text-xs py-3 sm:hidden">Swipe to see more</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
