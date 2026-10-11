import AdminFormModal from './AdminFormModal';
import Icon from './Icon';
import ImagePicker from './ImagePicker';
import { ItemList, ItemRow, RowActions } from './rows';
import { AddButton, Badge, EmptyState, ErrorNote, Field, FormActions, ListSkeleton, PageHeader, SectionHeading } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { useAdminList } from './useAdminList';
import { formatSermonDate, todayISO } from '../utils/sermons';

function DateTile({ date, muted }) {
  return (
    <div className={`w-12 flex-shrink-0 rounded-lg border text-center overflow-hidden bg-white ${muted ? 'border-gray-200' : 'border-royal/20'}`} aria-hidden="true">
      <div className={`text-[0.62rem] font-bold uppercase tracking-wider py-0.5 ${muted ? 'bg-gray-100 text-charcoal/60' : 'bg-royal text-white'}`}>
        {formatSermonDate(date, { month: 'short' })}
      </div>
      <div className={`font-serif text-lg font-semibold leading-8 ${muted ? 'text-charcoal/60' : 'text-royal'}`}>
        {formatSermonDate(date, { day: 'numeric' })}
      </div>
    </div>
  );
}

function EventForm({ event, onSave }) {
  const { values, setValue, field } = useFormValues({
    title: event.title ?? '',
    date: event.date ?? '',
    time: event.time ?? '',
    location: event.location ?? '',
    description: event.description ?? '',
    image: event.image ?? '',
    rsvp_link: event.rsvp_link ?? event.rsvpLink ?? '',
    is_past: event.is_past ?? false,
  });
  const { saving, error, submit } = useSaveForm(onSave);
  const datePassed = values.date && values.date < todayISO();

  const handleSubmit = (e) =>
    submit(e, {
      ...values,
      title: values.title.trim(),
      time: values.time.trim(),
      location: values.location.trim(),
      description: values.description.trim(),
      image: values.image || null,
      rsvp_link: values.rsvp_link.trim() || null,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field id="event-title" label="Event title">
        <input id="event-title" required placeholder="e.g. Youth Conference" className="form-input" {...field('title')} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="event-date" label="Date">
          <input id="event-date" type="date" required className="form-input" {...field('date')} />
        </Field>
        <Field id="event-time" label="Time">
          <input id="event-time" required placeholder="e.g. 9:00 AM" className="form-input" {...field('time')} />
        </Field>
      </div>

      <Field id="event-location" label="Location">
        <input id="event-location" required placeholder="e.g. Main sanctuary" className="form-input" {...field('location')} />
      </Field>

      <Field id="event-description" label="Description">
        <textarea id="event-description" required rows={3} className="form-input" {...field('description')} />
      </Field>

      <Field id="event-rsvp" label="RSVP or registration link" optional hint="A web address, or /contact to send people to the Contact page.">
        <input id="event-rsvp" type="text" inputMode="url" placeholder="https://…" className="form-input" {...field('rsvp_link')} />
      </Field>

      <Field label="Photo" optional>
        <ImagePicker id="event-image" value={values.image} onChange={(image) => setValue('image', image)} />
      </Field>

      <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer has-[:checked]:border-royal has-[:checked]:bg-royal-50/60">
        <input
          type="checkbox"
          checked={values.is_past}
          onChange={(e) => setValue('is_past', e.target.checked)}
          className="mt-0.5 w-5 h-5 accent-royal flex-shrink-0"
        />
        <span>
          <span className="block font-medium text-charcoal">Past event</span>
          <span className="block text-sm text-charcoal/60">
            {datePassed && !values.is_past
              ? 'This date has already passed. Tick this to show it with past events.'
              : 'Shows in the Past Events section of the Events page instead of Upcoming.'}
          </span>
        </span>
      </label>

      <FormActions saving={saving} error={error} saveLabel={event.id ? 'Save changes' : 'Add event'} />
    </form>
  );
}

export default function EventsAdmin() {
  const list = useAdminList('events', { noun: 'event', nameOf: (e) => e.title });
  const today = todayISO();

  const upcoming = list.rows.filter((e) => !e.is_past).sort((a, b) => a.date.localeCompare(b.date));
  const past = list.rows.filter((e) => e.is_past).sort((a, b) => b.date.localeCompare(a.date));
  const happened = upcoming.filter((e) => e.date < today);

  const moveAllToPast = () =>
    list.update(
      (q) => q.update({ is_past: true }).in('id', happened.map((e) => e.id)),
      `Moved ${happened.length} ${happened.length === 1 ? 'event' : 'events'} to past events`,
    );

  const renderRow = (event) => (
    <ItemRow
      key={event.id}
      media={<DateTile date={event.date} muted={event.is_past} />}
      title={event.title}
      openLabel={`Edit ${event.title}`}
      onOpen={() => list.startEditing(event)}
      badges={!event.is_past && event.date < today && <Badge tone="gold">Date passed</Badge>}
      meta={[event.time, event.location].filter(Boolean).join(' · ')}
      actions={
        <RowActions
          name={event.title}
          items={[
            { label: 'Edit', icon: 'edit', onClick: () => list.startEditing(event) },
            {
              label: event.is_past ? 'Move to upcoming' : 'Move to past events',
              icon: 'archive',
              onClick: () =>
                list.update(
                  (q) => q.update({ is_past: !event.is_past }).eq('id', event.id),
                  event.is_past ? `“${event.title}” moved to upcoming` : `“${event.title}” moved to past events`,
                ),
            },
            { label: 'Delete', icon: 'trash', onClick: () => list.remove(event), danger: true },
          ]}
        />
      }
    />
  );

  return (
    <>
      <PageHeader
        title="Events"
        description="Upcoming gatherings and memories from past events, shown on the Events page and the home page."
        action={<AddButton onClick={() => list.startAdding()}>Add event</AddButton>}
      />
      <ErrorNote>{list.error}</ErrorNote>

      {happened.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
          <Icon name="calendar" className="w-6 h-6 text-gold-600" />
          <p className="flex-1 text-sm text-charcoal">
            <strong className="font-semibold">
              {happened.length} {happened.length === 1 ? 'event has' : 'events have'} already happened
            </strong>{' '}
            but {happened.length === 1 ? 'is' : 'are'} still listed as upcoming.
          </p>
          <button type="button" onClick={moveAllToPast} className="btn-secondary btn-sm">
            Move to past events
          </button>
        </div>
      )}

      {list.loading && <ListSkeleton rows={4} media="none" />}

      {!list.loading && list.rows.length === 0 && !list.error && (
        <EmptyState icon="calendar" title="No events yet" action={<AddButton onClick={() => list.startAdding()}>Add an event</AddButton>}>
          Share conferences, outreaches and special services with the congregation.
        </EmptyState>
      )}

      <div className="space-y-8">
        {upcoming.length > 0 && (
          <section>
            <SectionHeading title="Upcoming" count={upcoming.length} description="Soonest first. The next three appear on the home page." />
            <ItemList>{upcoming.map(renderRow)}</ItemList>
          </section>
        )}
        {past.length > 0 && (
          <section>
            <SectionHeading title="Past events" count={past.length} description="Most recent first." />
            <ItemList>{past.map(renderRow)}</ItemList>
          </section>
        )}
      </div>

      <AdminFormModal isOpen={list.editing !== null} onClose={list.closeForm} title={list.editing?.id ? 'Edit event' : 'Add event'}>
        {list.editing && <EventForm key={list.editing.id ?? 'new'} event={list.editing} onSave={list.save} />}
      </AdminFormModal>
    </>
  );
}
