import { Link } from 'react-router-dom';
import { useAdminTable } from './useAdminTable';
import { AddIcon, ErrorNote, PageHeader } from './ui';
import { parseVideoLink, sermonStatus, sermonThumbnail, todayISO } from '../utils/sermons';

function StatCard({ to, label, value, detail }) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-gold hover:shadow-md transition-all"
    >
      <p className="text-sm font-medium text-charcoal/70">{label}</p>
      <p className="font-serif text-3xl font-semibold text-royal mt-1">{value ?? '–'}</p>
      {detail && <p className="text-xs text-charcoal/60 mt-1 truncate">{detail}</p>}
    </Link>
  );
}

export default function Dashboard() {
  const sermons = useAdminTable('sermons');
  const ministries = useAdminTable('ministries');
  const serviceTimes = useAdminTable('service_times');

  const today = todayISO();
  const liveSermon = sermons.rows.find((s) => sermonStatus(s, today) === 'live');
  const pastSermons = sermons.rows.filter((s) => sermonStatus(s, today) === 'past');
  const pastCount = pastSermons.length;
  const upcomingCount = sermons.rows.filter((s) => sermonStatus(s, today) === 'upcoming').length;
  const mainService = serviceTimes.rows[0];

  return (
    <>
      <PageHeader title="Dashboard" description="Manage what visitors see on the home page." />
      <ErrorNote>{sermons.error || ministries.error || serviceTimes.error}</ErrorNote>

      {/* Today's live stream — the thing most often updated */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        {liveSermon ? (
          <div className="flex flex-col sm:flex-row">
            <img src={sermonThumbnail(liveSermon)} alt="" className="sm:w-64 aspect-video object-cover bg-gray-100" />
            <div className="p-5 flex-1 min-w-0">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />
                Live on the home page today
              </p>
              <h2 className="text-xl truncate">{liveSermon.title}</h2>
              <p className="text-sm text-charcoal/70">
                {liveSermon.speaker} &middot; {liveSermon.series} &middot; {parseVideoLink(liveSermon.link)?.provider}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link to="/admin/sermons" className="btn-secondary">Manage sermons</Link>
                <a href={liveSermon.link} target="_blank" rel="noopener noreferrer" className="btn-secondary">Open stream ↗</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl">No live sermon today</h2>
              <p className="text-sm text-charcoal/70 mt-1">
                Add today&rsquo;s YouTube or Facebook live link and it will show on the home page until the end of the day.{' '}
                {!sermons.loading &&
                  (pastSermons[0]
                    ? `Until then the home page shows the latest message, “${pastSermons[0].title}”.`
                    : 'Until then the home page shows a “No sermons yet” card.')}
              </p>
            </div>
            <Link to="/admin/sermons" state={{ addNew: true }} className="btn-primary flex-shrink-0">
              <AddIcon /> Add today&rsquo;s sermon
            </Link>
          </div>
        )}
      </section>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          to="/admin/sermons"
          label="Past sermons"
          value={sermons.loading ? null : pastCount}
          detail={upcomingCount ? `${upcomingCount} upcoming` : 'Shown on the Sermons page'}
        />
        <StatCard
          to="/admin/ministries"
          label="Ministries"
          value={ministries.loading ? null : ministries.rows.length}
          detail="First six shown on the home page"
        />
        <StatCard
          to="/admin/service-times"
          label="Service times"
          value={serviceTimes.loading ? null : serviceTimes.rows.length}
          detail={mainService ? `${mainService.name}: ${mainService.day}, ${mainService.time}` : 'None yet'}
        />
      </div>
    </>
  );
}
