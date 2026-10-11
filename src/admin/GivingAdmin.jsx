import AdminFormModal from './AdminFormModal';
import Icon from './Icon';
import { ItemList, ItemRow, RowActions } from './rows';
import { AddButton, EmptyState, ErrorNote, Field, FormActions, ListSkeleton, PageHeader, SectionHeading } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { useAdminList } from './useAdminList';

const kinds = {
  bank: {
    title: 'Bank accounts',
    noun: 'bank account',
    icon: 'building',
    providerLabel: 'Bank name',
    providers: ['National Bank of Malawi', 'Standard Bank', 'FDH Bank', 'NBS Bank', 'First Capital Bank', 'CDH Investment Bank', 'Ecobank'],
    labelLabel: 'Account name',
    labels: ['Katoto Assemblies of God'],
    valueLabel: 'Account number',
    valueInputMode: 'numeric',
  },
  mobile: {
    title: 'Mobile money',
    noun: 'mobile money number',
    icon: 'phone',
    providerLabel: 'Service',
    providers: ['TNM Mpamba', 'Airtel Money'],
    labelLabel: 'What the number is',
    labels: ['Phone number', 'Merchant code', 'Till number'],
    valueLabel: 'Number or code',
    valueInputMode: 'tel',
  },
};

function GivingForm({ method, onSave }) {
  const { values, setValue, field } = useFormValues({
    kind: method.kind ?? 'bank',
    provider: method.provider ?? '',
    label: method.label ?? (method.kind === 'mobile' ? 'Phone number' : ''),
    value: method.value ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);
  const kind = kinds[values.kind];

  const handleSubmit = (e) =>
    submit(e, { kind: values.kind, provider: values.provider.trim(), label: values.label.trim(), value: values.value.trim() });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset>
        <legend className="form-label">Type</legend>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(kinds).map(([value, { title, icon }]) => (
            <label
              key={value}
              className="flex items-center gap-3 min-h-[52px] rounded-lg border border-gray-300 px-3 cursor-pointer text-charcoal has-[:checked]:border-royal has-[:checked]:bg-royal-50/60 has-[:checked]:text-royal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold"
            >
              <input type="radio" name="giving-kind" value={value} checked={values.kind === value} onChange={() => setValue('kind', value)} className="sr-only" />
              <Icon name={icon} />
              <span className="text-sm font-medium">{title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="giving-provider" label={kind.providerLabel}>
        <input id="giving-provider" required list="giving-providers" className="form-input" {...field('provider')} />
      </Field>
      <Field id="giving-label" label={kind.labelLabel}>
        <input id="giving-label" required list="giving-labels" className="form-input" {...field('label')} />
      </Field>
      <Field id="giving-value" label={kind.valueLabel} hint="Shown on the Give page exactly as typed.">
        <input id="giving-value" required inputMode={kind.valueInputMode} className="form-input tabular-nums" {...field('value')} />
      </Field>
      <datalist id="giving-providers">{kind.providers.map((p) => <option key={p} value={p} />)}</datalist>
      <datalist id="giving-labels">{kind.labels.map((l) => <option key={l} value={l} />)}</datalist>

      <FormActions saving={saving} error={error} saveLabel={method.id ? 'Save changes' : 'Add'} />
    </form>
  );
}

export default function GivingAdmin() {
  const list = useAdminList('giving_methods', { noun: 'giving method', nameOf: (m) => m.provider, ordered: true });

  // Each kind is ordered on its own; moving swaps with the neighbouring row of the same kind
  const renderSection = (kindKey) => {
    const kind = kinds[kindKey];
    const items = list.rows.filter((m) => m.kind === kindKey);
    const moveWithin = (item, step) => {
      const neighbour = items[items.indexOf(item) + step];
      list.move(list.rows.indexOf(item), list.rows.indexOf(neighbour));
    };

    return (
      <section key={kindKey}>
        <SectionHeading
          title={kind.title}
          count={items.length}
          action={<AddButton variant="secondary" onClick={() => list.startAdding({ kind: kindKey })}>Add</AddButton>}
        />
        {items.length === 0 ? (
          <EmptyState icon={kind.icon}>No {kind.noun}s yet. They’ll appear on the Give page once added.</EmptyState>
        ) : (
          <ItemList ordered>
            {items.map((method, i) => (
              <ItemRow
                key={method.id}
                media={
                  <span className="w-11 h-11 rounded-lg bg-royal-50 text-royal flex items-center justify-center flex-shrink-0">
                    <Icon name={kind.icon} />
                  </span>
                }
                title={method.provider}
                openLabel={`Edit ${method.provider}`}
                onOpen={() => list.startEditing(method)}
                meta={
                  <>
                    {method.label}: <span className="font-medium text-charcoal tabular-nums">{method.value}</span>
                  </>
                }
                actions={
                  <RowActions
                    name={method.provider}
                    items={[
                      { label: 'Edit', icon: 'edit', onClick: () => list.startEditing(method) },
                      { label: 'Move up', icon: 'up', onClick: () => moveWithin(method, -1), disabled: i === 0 },
                      { label: 'Move down', icon: 'down', onClick: () => moveWithin(method, 1), disabled: i === items.length - 1 },
                      { label: 'Delete', icon: 'trash', onClick: () => list.remove(method), danger: true },
                    ]}
                  />
                }
              />
            ))}
          </ItemList>
        )}
      </section>
    );
  };

  return (
    <>
      <PageHeader title="Giving" description="Bank and mobile money details shown on the Give page. Double-check numbers before saving." />
      <ErrorNote>{list.error}</ErrorNote>
      {list.loading ? <ListSkeleton rows={3} media="none" /> : <div className="space-y-8">{['bank', 'mobile'].map(renderSection)}</div>}

      <AdminFormModal
        isOpen={list.editing !== null}
        onClose={list.closeForm}
        title={list.editing?.id ? 'Edit giving method' : `Add ${kinds[list.editing?.kind ?? 'bank'].noun}`}
        size="small"
      >
        {list.editing && <GivingForm key={list.editing.id ?? 'new'} method={list.editing} onSave={list.save} />}
      </AdminFormModal>
    </>
  );
}
