import { Link, useOutletContext } from 'react-router-dom';
import Icon from './Icon';
import { useAdminTable } from './useAdminTable';
import { ErrorNote, PageHeader } from './ui';
import { greeting, timeAgo } from './format';
import { formatSermonDate, parseVideoLink, sermonStatus, sermonThumbnail, todayISO } from '../utils/sermons';

function TodayCard({ sermons }) {
  const today = todayISO();
  const liveSermon = sermons.rows.find((s) => sermonStatus(s, today) === 'live');
  const latestPast = sermons.rows.find((s) => sermonStatus(s, today) === 'past');

  if (sermons.loading) {
    return <div className="h-40 rounded-xl bg-white border border-gray-200 animate-pulse" aria-hidden="true" />;
  }

  if (liveSermon) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
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
            <a href={liveSermon.link} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
              Open stream <Icon name="external" className="w-4 h-4" />
            </a>
            <Link to="/admin/sermons" className="btn-secondary btn-sm">Manage sermons</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="w-12 h-12 rounded-full bg-royal-50 text-royal flex items-center justify-center flex-shrink-0">
        <Icon name="sermons" className="w-6 h-6" />
      </span>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg">No live sermon today</h2>
        <p className="text-sm text-charcoal/70 mt-0.5">
          {latestPast
            ? <>The home page is showing the latest message, <strong className="font-medium text-charcoal">{latestPast.title}</strong>.</>
            : 'The home page is showing a “No sermons yet” card.'}{' '}
          Add a live link and it will be featured for the rest of the day.
        </p>
      </div>
      <Link to="/admin/sermons" state={{ addNew: true }} className="btn-primary flex-shrink-0">
        <Icon name="plus" strokeWidth={2} /> Add today&rsquo;s sermon
      </Link>
    </div>
  );
}

function InboxCard({ to, icon, label, count, detail, emptyText }) {
  const waiting = count > 0;
  return (
    <Link
      to={to}
      className={`group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md ${
        waiting ? 'bg-gold-50 border-gold-200 hover:border-gold' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <span className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${waiting ? 'bg-gold text-white' : 'bg-green-50 text-green-700'}`}>
        <Icon name={waiting ? icon : 'check'} strokeWidth={waiting ? 1.6 : 2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal/70">{label}</p>
        <p className="font-serif text-2xl font-semibold text-royal leading-tight">{waiting ? count : 'All caught up'}</p>
        <p className="text-xs text-charcoal/60 mt-1 truncate">{waiting ? detail : emptyText}</p>
      </div>
      <Icon name="chevronRight" className="w-5 h-5 text-charcoal/30 group-hover:text-royal self-center" />
    </Link>
  );
}

function ContentCard({ to, icon, label, value, detail }) {
  return (
    <Link to={to} className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-gold hover:shadow-md transition-all">
      <span className="w-10 h-10 rounded-lg bg-royal-50 text-royal flex items-center justify-center flex-shrink-0">
        <Icon name={icon} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-royal">{label}</p>
        <p className="text-xs text-charcoal/60 truncate">
          {value !== null && <span className="font-medium text-charcoal/80">{value} &middot; </span>}
          {detail}
        </p>
      </div>
      <Icon name="chevronRight" className="w-5 h-5 text-charcoal/30 group-hover:text-royal" />
    </Link>
  );
}

export default function Dashboard() {
  const { counts } = useOutletContext();
  const sermons = useAdminTable('sermons');
  const events = useAdminTable('events');
  const ministries = useAdminTable('ministries');
  const serviceTimes = useAdminTable('service_times');
  const giving = useAdminTable('giving_methods');
  const messages = useAdminTable('contact_messages');

  const today = todayISO();
  const pastCount = sermons.rows.filter((s) => sermonStatus(s, today) === 'past').length;
  const upcomingSermons = sermons.rows.filter((s) => sermonStatus(s, today) === 'upcoming').length;
  const upcomingEvents = events.rows.filter((e) => !e.is_past);
  const nextEvent = upcomingEvents.find((e) => e.date >= today) ?? upcomingEvents[0];
  const mainService = serviceTimes.rows[0];
  const latestUnread = messages.rows.find((m) => !m.is_read);
  const count = (table, n) => (table.loading ? null : n);

  return (
    <>
      <PageHeader title="Dashboard" description={`${greeting()}. Here’s what needs your attention and what’s on the website.`} />
      <ErrorNote>{sermons.error || events.error || ministries.error || serviceTimes.error || giving.error || messages.error}</ErrorNote>

      <section aria-labelledby="today-heading" className="mb-8">
        <h2 id="today-heading" className="sr-only">Today</h2>
        <TodayCard sermons={sermons} />
      </section>

      <section aria-labelledby="inbox-heading" className="mb-8">
        <h2 id="inbox-heading" className="text-lg mb-3">Needs attention</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InboxCard
            to="/admin/messages"
            icon="inbox"
            label="Unread messages"
            count={counts.messages}
            detail={latestUnread ? `Latest from ${latestUnread.name}, ${timeAgo(latestUnread.created_at)}` : 'From the Contact page'}
            emptyText="No unread messages"
          />
          <InboxCard
            to="/admin/prayer"
            icon="heart"
            label="Prayer requests to approve"
            count={counts.prayer}
            detail="Waiting to appear on the prayer wall"
            emptyText="Nothing waiting for the prayer wall"
          />
        </div>
      </section>

      <section aria-labelledby="content-heading">
        <h2 id="content-heading" className="text-lg mb-3">Website content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ContentCard
            to="/admin/sermons"
            icon="sermons"
            label="Sermons"
            value={count(sermons, `${pastCount} past`)}
            detail={upcomingSermons ? `${upcomingSermons} upcoming` : 'Sermons page'}
          />
          <ContentCard
            to="/admin/events"
            icon="calendar"
            label="Events"
            value={count(events, `${upcomingEvents.length} upcoming`)}
            detail={nextEvent ? `Next: ${nextEvent.title}, ${formatSermonDate(nextEvent.date, { day: 'numeric', month: 'short' })}` : 'Events page'}
          />
          <ContentCard
            to="/admin/ministries"
            icon="ministries"
            label="Ministries"
            value={count(ministries, ministries.rows.length)}
            detail="First six on the home page"
          />
          <ContentCard
            to="/admin/service-times"
            icon="clock"
            label="Service times"
            value={count(serviceTimes, serviceTimes.rows.length)}
            detail={mainService ? `${mainService.day}, ${mainService.time}` : 'Footer & Visit page'}
          />
          <ContentCard to="/admin/about" icon="book" label="About page" value={null} detail="Story, beliefs & leadership" />
          <ContentCard
            to="/admin/give"
            icon="give"
            label="Giving"
            value={count(giving, giving.rows.length)}
            detail="Bank & mobile money"
          />
        </div>
      </section>
    </>
  );
}
