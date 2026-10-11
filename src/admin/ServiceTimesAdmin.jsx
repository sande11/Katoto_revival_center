import AdminFormModal from './AdminFormModal';
import Icon from './Icon';
import { ItemList, ItemRow, RowActions } from './rows';
import { AddButton, Badge, EmptyState, ErrorNote, Field, FormActions, ListSkeleton, PageHeader } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { orderedRowActions, useAdminList } from './useAdminList';

const daySuggestions = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  'First Saturday', 'Second Saturday', 'Last Friday',
];

function ServiceTimeForm({ serviceTime, onSave }) {
  const { values, field } = useFormValues({
    name: serviceTime.name ?? '',
    day: serviceTime.day ?? '',
    time: serviceTime.time ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);

  const handleSubmit = (e) => submit(e, { name: values.name.trim(), day: values.day.trim(), time: values.time.trim() });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field id="service-name" label="Service">
        <input id="service-name" required placeholder="e.g. Sunday Worship" className="form-input" {...field('name')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field id="service-day" label="Day">
          <input id="service-day" required list="service-days" placeholder="e.g. Sunday" className="form-input" {...field('day')} />
        </Field>
        <Field id="service-time" label="Time">
          <input id="service-time" required placeholder="e.g. 9:00 AM" className="form-input" {...field('time')} />
        </Field>
        <datalist id="service-days">{daySuggestions.map((d) => <option key={d} value={d} />)}</datalist>
      </div>
      <FormActions saving={saving} error={error} saveLabel={serviceTime.id ? 'Save changes' : 'Add service time'} />
    </form>
  );
}

export default function ServiceTimesAdmin() {
  const list = useAdminList('service_times', { noun: 'service time', nameOf: (s) => s.name, ordered: true });

  return (
    <>
      <PageHeader
        title="Service times"
        description="Shown in the footer and on the Plan Your Visit page. The first one is also shown on the home page."
        action={<AddButton onClick={() => list.startAdding()}>Add service time</AddButton>}
      />
      <ErrorNote>{list.error}</ErrorNote>

      {list.loading && <ListSkeleton rows={4} media="none" />}

      {!list.loading && list.rows.length === 0 && !list.error && (
        <EmptyState icon="clock" title="No service times yet" action={<AddButton onClick={() => list.startAdding()}>Add a service time</AddButton>}>
          Let visitors know when to join you.
        </EmptyState>
      )}

      {list.rows.length > 0 && (
        <ItemList ordered>
          {list.rows.map((serviceTime, i) => (
            <ItemRow
              key={serviceTime.id}
              media={
                <span className="w-11 h-11 rounded-lg bg-royal-50 text-royal flex items-center justify-center flex-shrink-0">
                  <Icon name="clock" />
                </span>
              }
              title={serviceTime.name}
              openLabel={`Edit ${serviceTime.name}`}
              onOpen={() => list.startEditing(serviceTime)}
              badges={i === 0 && <Badge tone="gold">Home page</Badge>}
              meta={`${serviceTime.day}, ${serviceTime.time}`}
              actions={<RowActions name={serviceTime.name} items={orderedRowActions(list, serviceTime, i)} />}
            />
          ))}
        </ItemList>
      )}

      <AdminFormModal
        isOpen={list.editing !== null}
        onClose={list.closeForm}
        title={list.editing?.id ? 'Edit service time' : 'Add service time'}
        size="small"
      >
        {list.editing && <ServiceTimeForm key={list.editing.id ?? 'new'} serviceTime={list.editing} onSave={list.save} />}
      </AdminFormModal>
    </>
  );
}
