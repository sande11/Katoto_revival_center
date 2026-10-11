import AdminFormModal from './AdminFormModal';
import ImagePicker from './ImagePicker';
import { ItemList, ItemRow, RowActions, RowThumb } from './rows';
import { AddButton, Badge, EmptyState, ErrorNote, Field, FormActions, ListSkeleton, PageHeader } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { orderedRowActions, useAdminList } from './useAdminList';
import { ministryEmoji, ministryIcons } from '../data/ministries';
import { resolveImage } from '../utils/images';

const HOME_PAGE_COUNT = 6;

function MinistryForm({ ministry, onSave }) {
  const { values, setValue, field } = useFormValues({
    name: ministry.name ?? '',
    description: ministry.description ?? '',
    leader: ministry.leader ?? '',
    schedule: ministry.schedule ?? '',
    icon: ministry.icon ?? '',
    image: ministry.image ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);

  const handleSubmit = (e) =>
    submit(e, {
      name: values.name.trim(),
      description: values.description.trim(),
      leader: values.leader.trim() || null,
      schedule: values.schedule.trim() || null,
      icon: values.icon || null,
      image: values.image || null,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Field id="ministry-name" label="Name">
          <input id="ministry-name" required placeholder="e.g. Youth Ministry" className="form-input" {...field('name')} />
        </Field>
        <Field id="ministry-icon" label="Icon">
          <select id="ministry-icon" className="form-input pr-8" {...field('icon')}>
            {Object.entries(ministryIcons).map(([key, { emoji, label }]) => (
              <option key={key} value={key}>{emoji} {label}</option>
            ))}
            <option value="">✝️ Other</option>
          </select>
        </Field>
      </div>

      <Field id="ministry-description" label="Description" hint="One or two sentences. The home page shows the first two lines.">
        <textarea id="ministry-description" required rows={3} className="form-input" {...field('description')} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="ministry-leader" label="Leader" optional>
          <input id="ministry-leader" placeholder="e.g. Bro. David Kimani" className="form-input" {...field('leader')} />
        </Field>
        <Field id="ministry-schedule" label="When they meet" optional>
          <input id="ministry-schedule" placeholder="e.g. Fridays, 6:00 PM" className="form-input" {...field('schedule')} />
        </Field>
      </div>

      <Field label="Photo" optional>
        <ImagePicker id="ministry-image" value={values.image} onChange={(image) => setValue('image', image)} />
      </Field>

      <FormActions saving={saving} error={error} saveLabel={ministry.id ? 'Save changes' : 'Add ministry'} />
    </form>
  );
}

export default function MinistriesAdmin() {
  const list = useAdminList('ministries', { noun: 'ministry', nameOf: (m) => m.name, ordered: true });

  return (
    <>
      <PageHeader
        title="Ministries"
        description={`Shown on the Ministries page in this order. The first ${HOME_PAGE_COUNT} also appear on the home page.`}
        action={<AddButton onClick={() => list.startAdding({ icon: 'youth' })}>Add ministry</AddButton>}
      />
      <ErrorNote>{list.error}</ErrorNote>

      {list.loading && <ListSkeleton rows={5} />}

      {!list.loading && list.rows.length === 0 && !list.error && (
        <EmptyState icon="ministries" title="No ministries yet" action={<AddButton onClick={() => list.startAdding({ icon: 'youth' })}>Add a ministry</AddButton>}>
          Add the church’s ministries so visitors can find a place to belong.
        </EmptyState>
      )}

      {list.rows.length > 0 && (
        <ItemList ordered>
          {list.rows.map((ministry, i) => (
            <ItemRow
              key={ministry.id}
              media={<RowThumb src={resolveImage(ministry.image)} fallback={ministryEmoji(ministry.icon)} />}
              title={`${ministryEmoji(ministry.icon)} ${ministry.name}`}
              openLabel={`Edit ${ministry.name}`}
              onOpen={() => list.startEditing(ministry)}
              badges={i < HOME_PAGE_COUNT && <Badge tone="gold">Home page</Badge>}
              meta={[ministry.leader, ministry.schedule].filter(Boolean).join(' · ') || ministry.description}
              actions={<RowActions name={ministry.name} items={orderedRowActions(list, ministry, i)} />}
            />
          ))}
        </ItemList>
      )}

      <AdminFormModal isOpen={list.editing !== null} onClose={list.closeForm} title={list.editing?.id ? 'Edit ministry' : 'Add ministry'}>
        {list.editing && <MinistryForm key={list.editing.id ?? 'new'} ministry={list.editing} onSave={list.save} />}
      </AdminFormModal>
    </>
  );
}
