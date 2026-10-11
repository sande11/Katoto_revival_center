import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminFormModal from './AdminFormModal';
import ImagePicker from './ImagePicker';
import { ItemList, ItemRow, RowActions, RowThumb } from './rows';
import { AddButton, Badge, EmptyState, ErrorNote, Field, FormActions, ListSkeleton, PageHeader, SearchInput, SectionHeading } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { useAdminList } from './useAdminList';
import { formatSermonDate, parseVideoLink, sermonStatus, sermonThumbnail, todayISO } from '../utils/sermons';

const groups = [
  { status: 'live', title: 'Live today', description: 'Featured on the home page today; moves to past sermons tomorrow.' },
  { status: 'upcoming', title: 'Upcoming', description: 'Hidden from the website until their date.' },
  { status: 'past', title: 'Past sermons', description: 'Listed on the Sermons page. The latest is featured on the home page when nothing is live.' },
];

function SermonForm({ sermon, speakers, seriesList, onSave }) {
  const { values, setValue, field } = useFormValues({
    link: sermon.link ?? '',
    title: sermon.title ?? '',
    speaker: sermon.speaker ?? '',
    series: sermon.series ?? '',
    date: sermon.date ?? todayISO(),
    thumbnail: sermon.thumbnail ?? '',
    description: sermon.description ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);

  const video = values.link ? parseVideoLink(values.link) : null;
  const linkInvalid = Boolean(values.link) && !video;
  const status = values.date ? sermonStatus(values) : null;

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
      <Field
        id="sermon-link"
        label="YouTube or Facebook link"
        error={linkInvalid && 'This doesn’t look like a YouTube or Facebook video. Open the stream and copy the link from the address bar or the Share button.'}
        hint={video ? `✓ ${video.provider} video` : 'Paste the link to the live stream or video. You can add it before the stream starts.'}
      >
        <input
          id="sermon-link"
          type="url"
          inputMode="url"
          required
          placeholder="https://www.youtube.com/live/…"
          className="form-input"
          aria-invalid={linkInvalid}
          {...field('link')}
        />
      </Field>

      <Field id="sermon-title" label="Title">
        <input id="sermon-title" required className="form-input" {...field('title')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="sermon-speaker" label="Speaker">
          <input id="sermon-speaker" required list="sermon-speakers" className="form-input" {...field('speaker')} />
        </Field>
        <Field id="sermon-series" label="Series">
          <input id="sermon-series" required list="sermon-series-list" className="form-input" {...field('series')} />
        </Field>
        <datalist id="sermon-speakers">{speakers.map((s) => <option key={s} value={s} />)}</datalist>
        <datalist id="sermon-series-list">{seriesList.map((s) => <option key={s} value={s} />)}</datalist>
      </div>

      <Field
        id="sermon-date"
        label="Date"
        hint={
          status === 'live' ? 'Today: it will be featured as live on the home page until midnight.'
            : status === 'upcoming' ? 'In the future: hidden from the website until that day.'
              : 'In the past: it will go straight into past sermons.'
        }
      >
        <input id="sermon-date" type="date" required className="form-input" {...field('date')} />
      </Field>

      <Field id="sermon-description" label="Description" optional>
        <textarea id="sermon-description" rows={3} className="form-input" {...field('description')} />
      </Field>

      <Field
        label="Thumbnail"
        optional
        hint={video?.provider === 'YouTube' ? 'If left empty, the YouTube video’s own thumbnail is used.' : 'If left empty, a church photo is used.'}
      >
        <ImagePicker id="sermon-thumbnail" value={values.thumbnail} onChange={(thumbnail) => setValue('thumbnail', thumbnail)} />
      </Field>

      <FormActions saving={saving} error={error} saveLabel={sermon.id ? 'Save changes' : 'Add sermon'} />
    </form>
  );
}

export default function SermonsAdmin() {
  const list = useAdminList('sermons', { noun: 'sermon', nameOf: (s) => s.title });
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { startAdding } = list;

  // The dashboard's "Add today's sermon" button opens the form straight away
  const addNew = location.state?.addNew;
  useEffect(() => {
    if (!addNew) return;
    startAdding();
    navigate(location.pathname, { replace: true, state: null });
  }, [addNew, startAdding, navigate, location.pathname]);

  const today = todayISO();
  const speakers = useMemo(() => [...new Set(list.rows.map((r) => r.speaker))], [list.rows]);
  const seriesList = useMemo(() => [...new Set(list.rows.map((r) => r.series))], [list.rows]);
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? list.rows.filter((s) => [s.title, s.speaker, s.series].some((text) => text?.toLowerCase().includes(needle)))
    : list.rows;

  return (
    <>
      <PageHeader
        title="Sermons"
        description="Add the live stream link on the day of the service. It is featured on the home page that day and moves to past sermons afterwards."
        action={<AddButton onClick={() => list.startAdding()}>Add sermon</AddButton>}
      />
      <ErrorNote>{list.error}</ErrorNote>

      {list.loading && <ListSkeleton rows={4} />}

      {!list.loading && list.rows.length === 0 && !list.error && (
        <EmptyState
          icon="sermons"
          title="No sermons yet"
          action={<AddButton onClick={() => list.startAdding()}>Add the first sermon</AddButton>}
        >
          Paste a YouTube or Facebook link to share a live stream or a recorded message.
        </EmptyState>
      )}

      {list.rows.length > 0 && (
        <div className="mb-6 max-w-md">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by title, speaker or series" label="Search sermons" />
        </div>
      )}

      {needle && shown.length === 0 && (
        <p className="text-charcoal/70">No sermons match &ldquo;{query}&rdquo;.</p>
      )}

      <div className="space-y-8">
        {groups.map(({ status, title, description }) => {
          const items = shown.filter((r) => sermonStatus(r, today) === status);
          if (items.length === 0) return null;
          return (
            <section key={status}>
              <SectionHeading title={title} count={items.length} description={description} />
              <ItemList>
                {items.map((sermon) => (
                  <ItemRow
                    key={sermon.id}
                    media={<RowThumb src={sermonThumbnail(sermon)} />}
                    title={sermon.title}
                    openLabel={`Edit ${sermon.title}`}
                    onOpen={() => list.startEditing(sermon)}
                    badges={status === 'live' && <Badge tone="red" dot>Live</Badge>}
                    meta={
                      <>
                        {sermon.speaker} &middot; {sermon.series}
                        <span className="block text-xs text-charcoal/50">
                          {formatSermonDate(sermon.date)} &middot; {parseVideoLink(sermon.link)?.provider ?? 'Unknown link'}
                        </span>
                      </>
                    }
                    actions={
                      <RowActions
                        name={sermon.title}
                        items={[
                          { label: 'Edit', icon: 'edit', onClick: () => list.startEditing(sermon) },
                          { label: 'Open video', icon: 'external', href: sermon.link },
                          { label: 'Delete', icon: 'trash', onClick: () => list.remove(sermon), danger: true },
                        ]}
                      />
                    }
                  />
                ))}
              </ItemList>
            </section>
          );
        })}
      </div>

      <AdminFormModal isOpen={list.editing !== null} onClose={list.closeForm} title={list.editing?.id ? 'Edit sermon' : 'Add sermon'}>
        {list.editing && (
          <SermonForm key={list.editing.id ?? 'new'} sermon={list.editing} speakers={speakers} seriesList={seriesList} onSave={list.save} />
        )}
      </AdminFormModal>
    </>
  );
}
