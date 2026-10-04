import { useMemo, useState } from 'react';
import { ASSET_PREFIX, assetImages, isExpiringImageLink, resolveImage } from '../utils/images';

const folderLabels = {
  general: 'General',
  'children-ministry': 'Children',
  'mens-ministry': 'Men',
  'womens-ministry': 'Women',
  'youth-ministry': 'Youth',
  'praise-team': 'Praise team',
  pastors: 'Pastors',
  miscellenious: 'Church life',
};

const folders = [...new Set(assetImages.map((img) => img.folder))];

/**
 * Pick one of the church's photos (stored as "asset:<path>") or paste any image link.
 * value / onChange hold that stored string; '' means no image.
 */
export default function ImagePicker({ id, value, onChange, hint }) {
  const [tab, setTab] = useState(value && !value.startsWith(ASSET_PREFIX) ? 'link' : 'photos');
  const [folder, setFolder] = useState('all');
  const [failedUrl, setFailedUrl] = useState(null);

  const previewUrl = resolveImage(value);
  const linkValue = value && !value.startsWith(ASSET_PREFIX) ? value : '';
  const shown = useMemo(() => (folder === 'all' ? assetImages : assetImages.filter((img) => img.folder === folder)), [folder]);

  const tabClass = (name) =>
    `flex-1 min-h-[44px] px-3 text-sm font-medium rounded-md transition-colors ${
      tab === name ? 'bg-white text-royal shadow-sm' : 'text-charcoal/70 hover:text-royal'
    }`;

  return (
    <div>
      {/* Current choice */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-24 aspect-video rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          {previewUrl && failedUrl !== previewUrl && (
            <img src={previewUrl} alt="" className="w-full h-full object-cover" onError={() => setFailedUrl(previewUrl)} />
          )}
        </div>
        <div className="text-sm min-w-0">
          {!value && <p className="text-charcoal/70">No image selected</p>}
          {value && failedUrl === previewUrl && <p className="text-red-600">This image couldn&rsquo;t be loaded. Check the link.</p>}
          {value && failedUrl !== previewUrl && <p className="text-charcoal/70">Selected</p>}
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-royal font-medium hover:underline py-1">
              Remove image
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-gray-100 mb-3" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'photos'} className={tabClass('photos')} onClick={() => setTab('photos')}>
          Our photos
        </button>
        <button type="button" role="tab" aria-selected={tab === 'link'} className={tabClass('link')} onClick={() => setTab('link')}>
          Image link
        </button>
      </div>

      {tab === 'photos' ? (
        <div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-1">
            {['all', ...folders].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolder(f)}
                aria-pressed={folder === f}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  folder === f ? 'bg-royal border-royal text-white' : 'bg-white border-gray-300 text-charcoal hover:border-royal'
                }`}
              >
                {f === 'all' ? 'All' : folderLabels[f] ?? f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto overscroll-contain p-0.5">
            {shown.map((img) => {
              const selected = value === ASSET_PREFIX + img.key;
              return (
                <button
                  key={img.key}
                  type="button"
                  onClick={() => onChange(ASSET_PREFIX + img.key)}
                  aria-pressed={selected}
                  aria-label={`Use photo ${img.key}`}
                  className={`relative aspect-square rounded-md overflow-hidden bg-gray-100 ring-offset-2 transition ${
                    selected ? 'ring-4 ring-gold' : 'hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  {selected && (
                    <span className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor={id} className="sr-only">Image link</label>
          <input
            id={id}
            type="url"
            inputMode="url"
            value={linkValue}
            onChange={(e) => onChange(e.target.value.trim())}
            placeholder="https://…"
            className="form-input"
          />
          <p className="text-xs text-charcoal/60 mt-1.5">
            Paste the address of an image (right-click or long-press an image → Copy image address).
          </p>
          {isExpiringImageLink(linkValue) && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2">
              Facebook image links stop working after a few weeks. For a lasting image, pick one of our photos instead.
            </p>
          )}
        </div>
      )}
      {hint && <p className="text-xs text-charcoal/60 mt-2">{hint}</p>}
    </div>
  );
}
