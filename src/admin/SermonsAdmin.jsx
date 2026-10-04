import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import ImagePicker from './ImagePicker';
import { useAdminTable } from './useAdminTable';
import { useSaveForm } from './useSaveForm';
import { AddIcon, EmptyState, ErrorNote, FormActions, PageHeader, RowActions } from './ui';
import { formatSermonDate, parseVideoLink, sermonStatus, sermonThumbnail, todayISO } from '../utils/sermons';

const groups = [
  { status: 'live', title: 'Live today', note: 'Shown on the home page today. Moves to past sermons tomorrow.' },
  { status: 'upcoming', title: 'Upcoming', note: 'Hidden from the site until their date.' },
  { status: 'past', title: 'Past sermons', note: 'Listed on the Sermons page; the latest three appear on the home page.' },
];

function SermonForm({ sermon, speakers, seriesList, onSave, onCancel }) {
  const [values, setValues] = useState({
    link: sermon.link ?? '',
    title: sermon.title ?? '',
    speaker: sermon.speaker ?? '',
    series: sermon.series ?? '',
    date: sermon.date ?? todayISO(),
    thumbnail: sermon.thumbnail ?? '',
    description: sermon.description ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const video = values.link ? parseVideoLink(values.link) : null;
  const linkInvalid = Boolean(values.link) && !video;

  const handleSubmit = (e) => {
    if (linkInvalid) {
      e.preventDefault();
      return;
    }
    submit(e, {
      ...values,
      link: values.link.trim(),
      title: values.title.trim(),
      speaker: values.speaker.trim(),
      series: values.series.trim(),
      thumbnail: values.thumbnail || null,
      description: values.description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="sermon-link" className="form-label">YouTube or Facebook link</label>
        <input
          id="sermon-link"
          type="url"
          inputMode="url"
          required
          value={values.link}
          onChange={set('link')}
          placeholder="https://www.youtube.com/live/…"
          className="form-input"
          aria-invalid={linkInvalid}
          aria-describedby="sermon-link-help"
        />
        <p id="sermon-link-help" className={`text-xs mt-1.5 ${linkInvalid ? 'text-red-600' : 'text-charcoal/60'}`}>
          {linkInvalid
            ? 'This doesn’t look like a YouTube or Facebook video link. Open the live stream or video and copy the link from the address bar or Share button.'
            : video
              ? `${video.provider} video ✓`
              : 'Paste the link to the live stream or video — it can be added before the stream starts.'}
        </p>
      </div>

      <div>
        <label htmlFor="sermon-title" className="form-label">Title</label>
        <input id="sermon-title" required value={values.title} onChange={set('title')} className="form-input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sermon-speaker" className="form-label">Speaker</label>
          <input id="sermon-speaker" required list="sermon-speakers" value={values.speaker} onChange={set('speaker')} className="form-input" />
          <datalist id="sermon-speakers">
            {speakers.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="sermon-series" className="form-label">Series</label>
          <input id="sermon-series" required list="sermon-series-list" value={values.series} onChange={set('series')} className="form-input" />
          <datalist id="sermon-series-list">
            {seriesList.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>

      <div>
        <label htmlFor="sermon-date" className="form-label">Date</label>
        <input id="sermon-date" type="date" required value={values.date} onChange={set('date')} className="form-input" />
        <p className="text-xs text-charcoal/60 mt-1.5">
          Shown as live on the home page on this day, then moves to past sermons the next day.
        </p>
      </div>

      <div>
        <label htmlFor="sermon-description" className="form-label">Description <span className="text-charcoal/50 font-normal">(optional)</span></label>
        <textarea id="sermon-description" rows={3} value={values.description} onChange={set('description')} className="form-input" />
      </div>

      <div>
        <p className="form-label">Thumbnail <span className="text-charcoal/50 font-normal">(optional)</span></p>
        <ImagePicker
          id="sermon-thumbnail"
          value={values.thumbnail}
          onChange={(thumbnail) => setValues((v) => ({ ...v, thumbnail }))}
          hint={
            video?.provider === 'YouTube'
              ? 'If left empty, the YouTube video’s own thumbnail is used.'
              : 'If left empty, a church photo is used.'
          }
        />
      </div>

      <FormActions saving={saving} onCancel={onCancel} error={error} />
    </form>
  );
}

export default function SermonsAdmin() {
  const { rows, loading, error, mutate } = useAdminTable('sermons');
  const location = useLocation();
  // The dashboard's "Add today's sermon" button opens the form straight away
  const [editing, setEditing] = useState(location.state?.addNew ? {} : null);
  const [actionError, setActionError] = useState('');

  const today = todayISO();
  const speakers = useMemo(() => [...new Set(rows.map((r) => r.speaker))], [rows]);
  const seriesList = useMemo(() => [...new Set(rows.map((r) => r.series))], [rows]);

  const handleSave = async (values) => {
    if (editing.id) await mutate((q) => q.update(values).eq('id', editing.id));
    else await mutate((q) => q.insert(values));
    setEditing(null);
  };

  const handleDelete = async (sermon) => {
    if (!window.confirm(`Delete “${sermon.title}”? This can’t be undone.`)) return;
    setActionError('');
    try {
      await mutate((q) => q.delete().eq('id', sermon.id));
    } catch (err) {
      setActionError(`Couldn't delete: ${err.message}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Sermons"
        description="Add the live stream link on the day of the service. It shows on the home page that day and moves to past sermons afterwards."
        action={
          <button type="button" onClick={() => setEditing({})} className="btn-primary">
            <AddIcon /> Add sermon
          </button>
        }
      />
      <ErrorNote>{error || actionError}</ErrorNote>

      {!loading && rows.length === 0 && !error && (
        <EmptyState>No sermons yet. Add the first one with the button above.</EmptyState>
      )}

      <div className="space-y-8">
        {groups.map(({ status, title, note }) => {
          const items = rows.filter((r) => sermonStatus(r, today) === status);
          if (items.length === 0) return null;
          return (
            <section key={status}>
              <h2 className="text-lg flex items-center gap-2">
                {status === 'live' && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />}
                {title} <span className="text-charcoal/50 font-sans text-sm font-normal">({items.length})</span>
              </h2>
              <p className="text-sm text-charcoal/60 mb-3">{note}</p>
              <ul className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {items.map((sermon) => (
                  <li key={sermon.id} className="flex items-center gap-3 p-3 sm:p-4">
                    <img
                      src={sermonThumbnail(sermon)}
                      alt=""
                      className="w-20 sm:w-28 aspect-video rounded-md object-cover bg-gray-100 flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-royal truncate">{sermon.title}</p>
                      <p className="text-sm text-charcoal/70 truncate">
                        {sermon.speaker} &middot; {sermon.series}
                      </p>
                      <p className="text-xs text-charcoal/50">
                        {formatSermonDate(sermon.date)} &middot; {parseVideoLink(sermon.link)?.provider ?? 'Unknown link'}
                      </p>
                    </div>
                    <RowActions name={sermon.title} onEdit={() => setEditing(sermon)} onDelete={() => handleDelete(sermon)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Edit sermon' : 'Add sermon'}>
        {editing && (
          <SermonForm
            key={editing.id ?? 'new'}
            sermon={editing}
            speakers={speakers}
            seriesList={seriesList}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
