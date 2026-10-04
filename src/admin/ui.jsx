/**
 * Small building blocks shared by the admin screens.
 */

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="text-charcoal/70 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {children}
    </p>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-center text-charcoal/70">
      {children}
    </div>
  );
}

export function AddIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

const icons = {
  up: 'M5 15l7-7 7 7',
  down: 'M19 9l-7 7-7-7',
  edit: 'M16.862 4.487l2.651 2.651M18.5 3.5a1.875 1.875 0 012.652 2.652L7.5 19.804 3 21l1.196-4.5L18.5 3.5z',
  delete: 'M6 7h12M9 7V4h6v3m-7 4v6m4-6v6m4-10l-1 13H8L7 7',
};

function IconButton({ icon, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-charcoal/70 hover:text-royal hover:bg-gray-100'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
      </svg>
    </button>
  );
}

/** Edit / delete buttons for a list row, plus move up / down when the list has an order. */
export function RowActions({ name, onEdit, onDelete, onMoveUp, onMoveDown }) {
  return (
    <div className="flex items-center flex-shrink-0">
      {onMoveUp !== undefined && (
        <>
          <IconButton icon="up" label={`Move ${name} up`} onClick={onMoveUp} disabled={!onMoveUp} />
          <IconButton icon="down" label={`Move ${name} down`} onClick={onMoveDown} disabled={!onMoveDown} />
        </>
      )}
      <IconButton icon="edit" label={`Edit ${name}`} onClick={onEdit} />
      <IconButton icon="delete" label={`Delete ${name}`} onClick={onDelete} danger />
    </div>
  );
}

/** Save / Cancel row at the bottom of an edit form. */
export function FormActions({ saving, onCancel, error }) {
  return (
    <div className="pt-2">
      {error && <p className="text-sm text-red-600 mb-3" role="alert">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
