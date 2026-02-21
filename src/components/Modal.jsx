import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable modal with overlay. Closes on overlay click or Escape.
 * Use for sermon detail, event detail, gallery lightbox.
 */
export default function Modal({ isOpen, onClose, children, title, size = 'default' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const sizeClass = size === 'large' ? 'max-w-4xl' : size === 'small' ? 'max-w-md' : 'max-w-2xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="font-serif text-xl text-royal">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-charcoal/70 hover:text-royal text-2xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
