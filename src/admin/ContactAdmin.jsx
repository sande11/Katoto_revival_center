import { useAdminTable } from './useAdminTable';
import { useFeedback } from './feedback';
import { useFormValues, useSaveForm } from './formState';
import { ErrorNote, Field, FormActions, PageHeader } from './ui';
import { churchContact } from '../data/contact';

const sections = [
  {
    title: 'Contact details',
    fields: [
      { name: 'address', label: 'Address', required: true, wide: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone_display', label: 'Phone number', required: true, inputMode: 'tel', hint: 'As it should appear on the site, e.g. +265 998 107 748.' },
      { name: 'phone', label: 'Number for tap-to-call', required: true, inputMode: 'tel', hint: 'Filled in from the phone number; change only if calls should go elsewhere.' },
    ],
  },
  {
    title: 'Social media',
    fields: [
      { name: 'whatsapp_url', label: 'WhatsApp link', type: 'url', hint: 'e.g. https://wa.me/265998107748' },
      { name: 'facebook_url', label: 'Facebook page', type: 'url' },
      { name: 'youtube_url', label: 'YouTube channel', type: 'url' },
    ],
  },
  {
    title: 'Map & directions',
    fields: [
      {
        name: 'map_embed_url',
        label: 'Google Maps embed',
        type: 'url',
        wide: true,
        hint: 'In Google Maps: Share → Embed a map → Copy HTML, then paste it here. The link is picked out automatically.',
      },
      { name: 'directions_url', label: 'Directions link', type: 'url', wide: true, hint: 'Opens turn-by-turn directions in Google Maps.' },
    ],
  },
];

const allFields = sections.flatMap((s) => s.fields);
const defaults = {
  address: churchContact.address,
  email: churchContact.email,
  phone: churchContact.phone,
  phone_display: churchContact.phoneDisplay,
  whatsapp_url: churchContact.whatsappUrl,
  facebook_url: churchContact.facebookUrl,
  youtube_url: churchContact.youtubeUrl,
  map_embed_url: churchContact.mapEmbedUrl,
  directions_url: churchContact.directionsUrl,
};

// "+265 998-107 748" → "+265998107748"
const toDialable = (text) => text.replace(/[^\d+]/g, '');

function SettingsForm({ settings, onSave }) {
  const initial = Object.fromEntries(allFields.map(({ name }) => [name, settings?.[name] ?? defaults[name] ?? '']));
  const { values, setValue, field, dirty, markSaved } = useFormValues(initial);
  const { saving, error, submit } = useSaveForm(async (cleaned) => {
    await onSave(cleaned);
    markSaved();
  });

  const handleChange = (name) => (e) => {
    const text = e.target.value;
    if (name === 'map_embed_url') {
      // Accept the whole <iframe …> snippet Google gives and keep just its src
      setValue(name, text.match(/src=["']([^"']+)["']/i)?.[1] ?? text);
    } else if (name === 'phone_display') {
      setValue(name, text);
      // Keep the tap-to-call number in step unless it was set to something different
      if (values.phone === toDialable(values.phone_display)) setValue('phone', toDialable(text));
    } else {
      setValue(name, text);
    }
  };

  const handleSubmit = (e) => submit(e, Object.fromEntries(allFields.map(({ name }) => [name, values[name].trim() || null])));
  const mapUrl = values.map_embed_url?.startsWith('https://') ? values.map_embed_url : null;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="space-y-8">
        {sections.map((section) => (
          <fieldset key={section.title}>
            <legend className="font-serif text-lg font-semibold text-royal mb-4">{section.title}</legend>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
              {section.fields.map(({ name, label, type = 'text', required, wide, hint, inputMode }) => (
                <Field key={name} id={`contact-${name}`} label={label} optional={!required} hint={hint} className={wide ? 'sm:col-span-2' : ''}>
                  <input
                    id={`contact-${name}`}
                    type={name === 'map_embed_url' ? 'text' : type}
                    inputMode={inputMode ?? (type === 'url' ? 'url' : undefined)}
                    required={required}
                    className="form-input"
                    {...field(name)}
                    onChange={handleChange(name)}
                  />
                </Field>
              ))}
            </div>
            {section.title === 'Map & directions' && mapUrl && (
              <div className="mt-4">
                <p className="form-label">Map preview</p>
                <iframe title="Map preview" src={mapUrl} className="w-full h-56 rounded-lg border border-gray-200" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </fieldset>
        ))}
      </div>
      <FormActions saving={saving} error={error} dirty={dirty} saveLabel="Save changes" />
    </form>
  );
}

export default function ContactAdmin() {
  const settings = useAdminTable('contact_settings');
  const { toast } = useFeedback();

  const save = async (values) => {
    const current = settings.rows[0];
    if (current) await settings.mutate((q) => q.update({ ...values, updated_at: new Date().toISOString() }).eq('id', current.id));
    else await settings.mutate((q) => q.insert({ id: true, ...values }));
    toast('Church details saved');
  };

  return (
    <>
      <PageHeader title="Church details" description="Address, phone, email, social links and map shown on the Contact page." />
      <ErrorNote>{settings.error}</ErrorNote>
      {settings.loading ? (
        <div className="h-96 rounded-xl bg-white border border-gray-200 animate-pulse" aria-hidden="true" />
      ) : (
        <SettingsForm key={settings.rows[0]?.updated_at ?? 'new'} settings={settings.rows[0]} onSave={save} />
      )}
    </>
  );
}
