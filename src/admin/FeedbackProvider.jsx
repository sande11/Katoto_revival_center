import { useCallback, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import Icon from './Icon';
import { FeedbackContext } from './feedback';

let nextToastId = 0;

export default function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Dialog content stays set while it animates closed, so `open` is tracked separately
  const [dialog, setDialog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback((message, { tone = 'success' } = {}) => {
    const id = ++nextToastId;
    setToasts((list) => [...list.slice(-2), { id, message, tone }]);
    setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 3500);
  }, [dismiss]);

  const confirm = useCallback((options) => new Promise((resolve) => {
    setDialog({ confirmLabel: 'Delete', ...options, resolve });
    setDialogOpen(true);
  }), []);

  const answer = (result) => {
    dialog?.resolve(result);
    setDialogOpen(false);
  };

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <Modal isOpen={dialogOpen} onClose={() => answer(false)} title={dialog?.title} size="small">
        {dialog && (
          <>
            <p className="text-charcoal">{dialog.message}</p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
              {/* Cancel takes focus so pressing Enter never deletes by accident */}
              <button type="button" onClick={() => answer(false)} className="btn-secondary" autoFocus>
                Cancel
              </button>
              <button type="button" onClick={() => answer(true)} className="btn-danger">
                {dialog.confirmLabel}
              </button>
            </div>
          </>
        )}
      </Modal>

      <div
        aria-live="polite"
        className="fixed z-[60] inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 flex flex-col items-center sm:items-end gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-start gap-3 w-full sm:w-auto sm:max-w-sm rounded-xl px-4 py-3 text-sm shadow-lg animate-slide-up ${
              t.tone === 'error' ? 'bg-red-600 text-white' : 'bg-royal text-white'
            }`}
          >
            <Icon name={t.tone === 'error' ? 'alert' : 'checkCircle'} className={`w-5 h-5 ${t.tone === 'error' ? '' : 'text-gold'}`} />
            <p className="flex-1 pt-px">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} className="-m-1 p-1 rounded text-white/70 hover:text-white" aria-label="Dismiss">
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}
