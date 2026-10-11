import { cloneElement, isValidElement } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from './Icon';
import { useFormModal } from './formState';

/**
 * Page-level and form building blocks shared by the admin screens.
 */

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
      <Helmet>
        <title>{`${title} — Admin`}</title>
      </Helmet>
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="text-charcoal/70 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}

export function SectionHeading({ title, count, description, action }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h2 className="text-lg flex items-center gap-2">
          {title}
          {count !== undefined && <span className="text-sm font-sans font-normal text-charcoal/50">({count})</span>}
        </h2>
        {description && <p className="text-sm text-charcoal/60">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/** Primary "Add …" button used in page and section headers. */
export function AddButton({ children, onClick, variant = 'primary' }) {
  return (
    <button type="button" onClick={onClick} className={variant === 'primary' ? 'btn-primary' : 'btn-secondary btn-sm'}>
      <Icon name="plus" className="w-5 h-5" strokeWidth={2} /> {children}
    </button>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      <Icon name="alert" className="w-5 h-5" />
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, children, action }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-center">
      <span className="mx-auto mb-3 w-12 h-12 rounded-full bg-royal-50 text-royal flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      {title && <p className="font-semibold text-royal">{title}</p>}
      {children && <p className="text-sm text-charcoal/70 mt-1 max-w-sm mx-auto">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const badgeTones = {
  gray: 'bg-gray-100 text-charcoal/70',
  gold: 'bg-gold-100 text-gold-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700',
  royal: 'bg-royal-50 text-royal',
};

export function Badge({ tone = 'gray', dot, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide whitespace-nowrap ${badgeTones[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Circle with someone's initial, for messages and prayer requests. */
export function Avatar({ name }) {
  return (
    <span className="w-10 h-10 rounded-full bg-royal-50 text-royal font-semibold flex items-center justify-center flex-shrink-0 uppercase" aria-hidden="true">
      {name?.trim()?.[0] ?? '?'}
    </span>
  );
}

/** Grey placeholder rows shown while a list loads. */
export function ListSkeleton({ rows = 3, media = 'wide' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100" role="status">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 sm:px-4 animate-pulse" aria-hidden="true">
          {media === 'wide' && <div className="w-20 sm:w-24 aspect-video rounded-md bg-gray-100" />}
          {media === 'round' && <div className="w-11 h-11 rounded-full bg-gray-100" />}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-1/3 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Label + control + hint. Pass the control as the only child; id links the label and hint to it.
 * Without an id (e.g. the image picker) the label is plain text.
 */
export function Field({ id, label, optional, hint, error, className = '', children }) {
  const hintId = id && (hint || error) ? `${id}-hint` : undefined;
  const control = hintId && isValidElement(children) ? cloneElement(children, { 'aria-describedby': hintId }) : children;
  const labelText = (
    <>
      {label}
      {optional && <span className="text-charcoal/50 font-normal"> (optional)</span>}
    </>
  );
  return (
    <div className={className}>
      {id ? <label htmlFor={id} className="form-label">{labelText}</label> : <p className="form-label">{labelText}</p>}
      {control}
      {(hint || error) && (
        <p id={hintId} className={`text-xs mt-1.5 ${error ? 'text-red-600' : 'text-charcoal/60'}`}>{error || hint}</p>
      )}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search', label = 'Search' }) {
  return (
    <div className="relative">
      <Icon name="search" className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="form-input pl-11"
      />
    </div>
  );
}

/** Pill-shaped filter tabs with optional counts; scrolls sideways on narrow screens. */
export function FilterTabs({ label, options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex-shrink-0 inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full border text-sm font-medium transition-colors ${
              active ? 'bg-royal border-royal text-white' : 'bg-white border-gray-300 text-charcoal hover:border-royal hover:text-royal'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={`rounded-full px-1.5 min-w-[1.25rem] text-xs ${active ? 'bg-white/20' : 'bg-gray-100 text-charcoal/70'}`}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Save bar sticks to the bottom of the dialog (or the screen, for page forms) so it is always reachable
const saveBarClass =
  'sticky bottom-0 z-20 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-6 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur border-t border-gray-200 rounded-b-xl ' +
  'flex flex-col sm:flex-row sm:items-center gap-3';

/**
 * Save / Cancel bar at the bottom of a form. Inside AdminFormModal it also shows the
 * "discard changes?" prompt; on a page form (no modal) pass dirty to show the saved state.
 */
export function FormActions({ saving, error, dirty, saveLabel = 'Save' }) {
  const modal = useFormModal();

  if (modal?.askingToDiscard) {
    return (
      <div className={`${saveBarClass} bg-amber-50/95 border-amber-200`} role="alertdialog" aria-label="Discard changes?">
        <p className="text-sm font-medium text-amber-900 flex-1">Discard your unsaved changes?</p>
        <div className="flex gap-3">
          <button type="button" onClick={modal.keepEditing} className="btn-secondary flex-1 sm:flex-none" autoFocus>
            Keep editing
          </button>
          <button type="button" onClick={modal.discard} className="btn-danger flex-1 sm:flex-none">
            Discard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={saveBarClass}>
      <div className="flex-1 min-w-0 text-sm">
        {error ? (
          <p className="text-red-600" role="alert">{error}</p>
        ) : (
          !modal && (
            <p className={`flex items-center gap-1.5 ${dirty ? 'text-gold-700' : 'text-charcoal/50'}`}>
              {!dirty && <Icon name="check" className="w-4 h-4" strokeWidth={2} />}
              {dirty ? 'You have unsaved changes' : 'All changes saved'}
            </p>
          )
        )}
      </div>
      <div className="flex gap-3">
        {modal && (
          <button type="button" onClick={modal.requestClose} className="btn-secondary flex-1 sm:flex-none">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving || (!modal && !dirty)} className="btn-primary flex-1 sm:flex-none">
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
    </div>
  );
}
