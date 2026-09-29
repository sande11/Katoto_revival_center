import { useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable modal with overlay. Closes on overlay click or Escape.
 * Slides up as a bottom sheet on phones, centered dialog from sm up.
 * Use for sermon detail and event detail.
 */
export default function Modal({ isOpen, onClose, children, title, size = 'default' }) {
  const titleId = useId();

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

  const sizeClass = size === 'large' ? 'sm:max-w-4xl' : size === 'small' ? 'sm:max-w-md' : 'sm:max-w-2xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={`relative bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full ${sizeClass} max-h-[90dvh] overflow-y-auto overscroll-contain`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pl-4 pr-2 sm:pl-6 sm:pr-3 py-2 flex items-center justify-between gap-3">
                <h3 id={titleId} className="font-serif text-lg sm:text-xl text-royal py-1.5">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-charcoal/70 hover:text-royal hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4 sm:p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
