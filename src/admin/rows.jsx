import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

/**
 * List building blocks: a card holding rows, where tapping a row opens it for editing and
 * secondary actions sit on the right (icon buttons on wide screens, a "⋯" menu on phones).
 */

export function ItemList({ ordered, children }) {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">{children}</Tag>;
}

export function ItemRow({ media, title, meta, badges, onOpen, openLabel, actions }) {
  return (
    <li className="relative flex items-center gap-3 p-3 sm:px-4 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50 transition-colors">
      {media}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          {onOpen ? (
            // after:inset-0 stretches this button over the whole row, so the row is one big tap target
            <button
              type="button"
              onClick={onOpen}
              aria-label={openLabel}
              className="min-w-0 truncate text-left font-semibold text-royal after:absolute after:inset-0 focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-gold focus-visible:after:ring-inset"
            >
              {title}
            </button>
          ) : (
            <p className="min-w-0 truncate font-semibold text-royal">{title}</p>
          )}
          {badges && <span className="flex-shrink-0 flex items-center gap-1.5">{badges}</span>}
        </div>
        {meta && <div className="text-sm text-charcoal/70 truncate">{meta}</div>}
      </div>
      {actions && <div className="relative z-10 flex-shrink-0">{actions}</div>}
    </li>
  );
}

/** Square-ish thumbnail for a row; shows the fallback (e.g. an emoji) when there's no image. */
export function RowThumb({ src, fallback, shape = 'wide' }) {
  const shapeClass = shape === 'round' ? 'w-11 h-11 rounded-full' : 'w-16 sm:w-24 aspect-video rounded-md';
  return (
    <div className={`${shapeClass} overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-xl`}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" /> : <span aria-hidden="true">{fallback}</span>}
    </div>
  );
}

function ActionMenu({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const itemClass = (item) =>
    `w-full flex items-center gap-3 px-4 min-h-[44px] text-sm text-left disabled:opacity-40 ${
      item.danger ? 'text-red-600 hover:bg-red-50' : 'text-charcoal hover:bg-gray-50'
    }`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-charcoal/70 hover:bg-gray-100"
      >
        <Icon name="more" className="w-6 h-6" strokeWidth={2} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-1 z-30 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {items.map((item) =>
            item.href ? (
              <a key={item.label} role="menuitem" href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => { setOpen(false); item.onClick?.(); }} className={itemClass(item)}>
                <Icon name={item.icon} /> {item.label}
              </a>
            ) : (
              <button key={item.label} type="button" role="menuitem" disabled={item.disabled} onClick={() => { setOpen(false); item.onClick(); }} className={itemClass(item)}>
                <Icon name={item.icon} /> {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Row actions from a list of { label, icon, onClick | href, danger, disabled }; falsy entries are skipped.
 * Wide screens get icon buttons with tooltips; phones get the same actions, labelled, in a menu.
 */
export function RowActions({ name, items }) {
  const actions = items.filter(Boolean);
  return (
    <>
      <div className="hidden sm:flex items-center">
        {actions.map((item) => {
          const className = `w-10 h-10 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none ${
            item.danger ? 'text-red-600 hover:bg-red-50' : 'text-charcoal/60 hover:text-royal hover:bg-gray-100'
          }`;
          return item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={item.onClick} aria-label={`${item.label}: ${name}`} title={item.label} className={className}>
              <Icon name={item.icon} />
            </a>
          ) : (
            <button key={item.label} type="button" onClick={item.onClick} disabled={item.disabled} aria-label={`${item.label}: ${name}`} title={item.label} className={className}>
              <Icon name={item.icon} />
            </button>
          );
        })}
      </div>
      <div className="sm:hidden">
        <ActionMenu label={`Actions for ${name}`} items={actions} />
      </div>
    </>
  );
}
