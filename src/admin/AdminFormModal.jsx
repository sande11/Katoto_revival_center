import { useMemo, useRef, useState } from 'react';
import Modal from '../components/Modal';
import { FormModalContext } from './formState';

/**
 * Modal for add / edit forms. If the form has unsaved changes, closing it (Escape, the X,
 * tapping outside or Cancel) asks before discarding them; FormActions shows that prompt.
 */
export default function AdminFormModal({ isOpen, onClose, title, size, children }) {
  const dirtyRef = useRef(false);
  const [askingToDiscard, setAskingToDiscard] = useState(false);

  const context = useMemo(() => ({
    reportDirty: (dirty) => {
      dirtyRef.current = dirty;
    },
    requestClose: () => {
      if (dirtyRef.current) setAskingToDiscard(true);
      else onClose();
    },
    askingToDiscard,
    keepEditing: () => setAskingToDiscard(false),
    discard: () => {
      setAskingToDiscard(false);
      dirtyRef.current = false;
      onClose();
    },
  }), [onClose, askingToDiscard]);

  return (
    <Modal isOpen={isOpen} onClose={context.requestClose} title={title} size={size}>
      <FormModalContext.Provider value={context}>{children}</FormModalContext.Provider>
    </Modal>
  );
}
