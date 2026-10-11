import { useSearchParams } from 'react-router-dom';
import AdminFormModal from './AdminFormModal';
import ImagePicker from './ImagePicker';
import { ItemList, ItemRow, RowActions, RowThumb } from './rows';
import { AddButton, EmptyState, ErrorNote, Field, FilterTabs, FormActions, ListSkeleton, PageHeader, SectionHeading } from './ui';
import { useFormValues, useSaveForm } from './formState';
import { useAdminTable } from './useAdminTable';
import { orderedRowActions, useAdminList } from './useAdminList';
import { useFeedback } from './feedback';
import { aboutContent } from '../data/aboutContent';
import { resolveImage } from '../utils/images';

const storyFields = [
  { name: 'story_title', label: 'Story heading', rows: 0 },
  { name: 'story_first_paragraph', label: 'Story — first paragraph', rows: 5 },
  { name: 'story_second_paragraph', label: 'Story — second paragraph', rows: 5 },
  { name: 'vision', label: 'Vision', rows: 3 },
  { name: 'mission', label: 'Mission', rows: 3 },
  { name: 'affiliation', label: 'Affiliations', rows: 3, hint: 'Denomination, networks or partner churches.' },
];

function StoryForm({ content, onSave }) {
  const initial = Object.fromEntries(storyFields.map(({ name }) => [name, content?.[name] ?? aboutContent[name] ?? '']));
  const { values, field, dirty, markSaved } = useFormValues(initial);
  const { saving, error, submit } = useSaveForm(async (trimmed) => {
    await onSave(trimmed);
    markSaved();
  });

  const handleSubmit = (e) => submit(e, Object.fromEntries(storyFields.map(({ name }) => [name, values[name].trim()])));

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
      {storyFields.map(({ name, label, rows, hint }) => (
        <Field key={name} id={`about-${name}`} label={label} hint={hint}>
          {rows ? (
            <textarea id={`about-${name}`} required rows={rows} className="form-input" {...field(name)} />
          ) : (
            <input id={`about-${name}`} required className="form-input" {...field(name)} />
          )}
        </Field>
      ))}
      <FormActions saving={saving} error={error} dirty={dirty} saveLabel="Save changes" />
    </form>
  );
}

function BeliefForm({ belief, onSave }) {
  const { values, field } = useFormValues({ title: belief.title ?? '', content: belief.content ?? '' });
  const { saving, error, submit } = useSaveForm(onSave);
  return (
    <form onSubmit={(e) => submit(e, { title: values.title.trim(), content: values.content.trim() })} className="space-y-5">
      <Field id="belief-title" label="Title">
        <input id="belief-title" required placeholder="e.g. The Holy Spirit" className="form-input" {...field('title')} />
      </Field>
      <Field id="belief-content" label="Statement">
        <textarea id="belief-content" required rows={5} className="form-input" {...field('content')} />
      </Field>
      <FormActions saving={saving} error={error} saveLabel={belief.id ? 'Save changes' : 'Add belief'} />
    </form>
  );
}

function MemberForm({ member, onSave }) {
  const { values, setValue, field } = useFormValues({ name: member.name ?? '', title: member.title ?? '', bio: member.bio ?? '', image: member.image ?? '' });
  const { saving, error, submit } = useSaveForm(onSave);
  return (
    <form
      onSubmit={(e) => submit(e, { name: values.name.trim(), title: values.title.trim(), bio: values.bio.trim(), image: values.image || null })}
      className="space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="member-name" label="Name">
          <input id="member-name" required className="form-input" {...field('name')} />
        </Field>
        <Field id="member-title" label="Role">
          <input id="member-title" required placeholder="e.g. Senior Pastor" className="form-input" {...field('title')} />
        </Field>
      </div>
      <Field id="member-bio" label="Short bio">
        <textarea id="member-bio" required rows={4} className="form-input" {...field('bio')} />
      </Field>
      <Field label="Photo" optional hint="A head-and-shoulders photo works best; it is shown in a circle.">
        <ImagePicker id="member-image" value={values.image} onChange={(image) => setValue('image', image)} />
      </Field>
      <FormActions saving={saving} error={error} saveLabel={member.id ? 'Save changes' : 'Add person'} />
    </form>
  );
}

export default function AboutAdmin() {
  const about = useAdminTable('about_content');
  const beliefs = useAdminList('beliefs', { noun: 'belief', nameOf: (b) => b.title, ordered: true });
  const members = useAdminList('team_members', { noun: 'team member', nameOf: (m) => m.name, ordered: true });
  const { toast } = useFeedback();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'story';

  const saveStory = async (values) => {
    const current = about.rows[0];
    if (current) await about.mutate((q) => q.update({ ...values, updated_at: new Date().toISOString() }).eq('id', current.id));
    else await about.mutate((q) => q.insert({ id: true, ...values }));
    toast('About page saved');
  };

  return (
    <>
      <PageHeader title="About page" description="The church’s story, statement of faith and leadership team." />
      <ErrorNote>{about.error || beliefs.error || members.error}</ErrorNote>

      <div className="mb-6">
        <FilterTabs
          label="About page sections"
          value={tab}
          onChange={(value) => setParams({ tab: value }, { replace: true })}
          options={[
            { value: 'story', label: 'Story & mission' },
            { value: 'beliefs', label: 'Statement of faith', count: beliefs.loading ? undefined : beliefs.rows.length },
            { value: 'team', label: 'Leadership', count: members.loading ? undefined : members.rows.length },
          ]}
        />
      </div>

      {tab === 'story' &&
        (about.loading ? (
          <div className="h-96 rounded-xl bg-white border border-gray-200 animate-pulse" aria-hidden="true" />
        ) : (
          <StoryForm key={about.rows[0]?.updated_at ?? 'new'} content={about.rows[0]} onSave={saveStory} />
        ))}

      {tab === 'beliefs' && (
        <section>
          <SectionHeading
            title="Statement of faith"
            description="Shown on the About page in this order."
            action={<AddButton variant="secondary" onClick={() => beliefs.startAdding()}>Add belief</AddButton>}
          />
          {beliefs.loading && <ListSkeleton rows={4} media="none" />}
          {!beliefs.loading && beliefs.rows.length === 0 && <EmptyState icon="book">No beliefs yet.</EmptyState>}
          {beliefs.rows.length > 0 && (
            <ItemList ordered>
              {beliefs.rows.map((belief, i) => (
                <ItemRow
                  key={belief.id}
                  media={
                    <span className="w-9 h-9 rounded-full bg-royal-50 text-royal text-sm font-semibold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                  }
                  title={belief.title}
                  openLabel={`Edit ${belief.title}`}
                  onOpen={() => beliefs.startEditing(belief)}
                  meta={belief.content}
                  actions={<RowActions name={belief.title} items={orderedRowActions(beliefs, belief, i)} />}
                />
              ))}
            </ItemList>
          )}
        </section>
      )}

      {tab === 'team' && (
        <section>
          <SectionHeading
            title="Leadership team"
            description="Shown on the About page in this order."
            action={<AddButton variant="secondary" onClick={() => members.startAdding()}>Add person</AddButton>}
          />
          {members.loading && <ListSkeleton rows={3} media="round" />}
          {!members.loading && members.rows.length === 0 && <EmptyState icon="ministries">No team members yet.</EmptyState>}
          {members.rows.length > 0 && (
            <ItemList ordered>
              {members.rows.map((member, i) => (
                <ItemRow
                  key={member.id}
                  media={<RowThumb shape="round" src={resolveImage(member.image)} fallback={member.name[0]} />}
                  title={member.name}
                  openLabel={`Edit ${member.name}`}
                  onOpen={() => members.startEditing(member)}
                  meta={member.title}
                  actions={<RowActions name={member.name} items={orderedRowActions(members, member, i)} />}
                />
              ))}
            </ItemList>
          )}
        </section>
      )}

      <AdminFormModal isOpen={beliefs.editing !== null} onClose={beliefs.closeForm} title={beliefs.editing?.id ? 'Edit belief' : 'Add belief'}>
        {beliefs.editing && <BeliefForm key={beliefs.editing.id ?? 'new'} belief={beliefs.editing} onSave={beliefs.save} />}
      </AdminFormModal>
      <AdminFormModal isOpen={members.editing !== null} onClose={members.closeForm} title={members.editing?.id ? 'Edit team member' : 'Add team member'}>
        {members.editing && <MemberForm key={members.editing.id ?? 'new'} member={members.editing} onSave={members.save} />}
      </AdminFormModal>
    </>
  );
}
