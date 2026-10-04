import { Helmet } from 'react-helmet-async';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo-ag.png';
import { useAdminAuth } from './auth';

const icons = {
  dashboard: 'M4 5a1 1 0 011-1h5v7H4V5zm10-1h5a1 1 0 011 1v4h-6V4zM4 15h6v5H5a1 1 0 01-1-1v-4zm10-2h6v6a1 1 0 01-1 1h-5v-7z',
  sermons: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  ministries: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  serviceTimes: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
};

// Grouped by the public page the content appears on; more pages get their own group later
const navGroups = [
  { items: [{ to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true }] },
  {
    title: 'Home page',
    items: [
      { to: '/admin/sermons', label: 'Sermons', icon: 'sermons' },
      { to: '/admin/ministries', label: 'Ministries', icon: 'ministries' },
      { to: '/admin/service-times', label: 'Service Times', icon: 'serviceTimes' },
    ],
  },
];

function NavIcon({ name }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
    </svg>
  );
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
    isActive ? 'bg-white/15 text-gold' : 'text-white/80 hover:bg-white/10 hover:text-white'
  }`;

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();

  const brand = (
    <Link to="/admin" className="flex items-center gap-3 min-w-0">
      <img src={logo} alt="" className="w-10 h-10 rounded-full border-2 border-gold flex-shrink-0" />
      <span className="min-w-0 leading-tight">
        <span className="block font-serif font-bold text-gold truncate">Katoto Revival</span>
        <span className="block text-xs uppercase tracking-widest text-white/70">Admin</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin — Katoto Revival Center</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-royal text-white">
        <div className="px-5 py-5 border-b border-white/10">{brand}</div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Admin">
          {navGroups.map((group, i) => (
            <div key={i}>
              {group.title && (
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{group.title}</p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                    <NavIcon name={item.icon} /> {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-sm space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block text-white/80 hover:text-gold">
            View website ↗
          </a>
          <p className="text-white/60 truncate" title={user?.email}>{user?.email}</p>
          <button type="button" onClick={signOut} className="text-gold font-medium hover:underline">
            Sign out
          </button>
        </div>
      </aside>

      {/* Phone / tablet header: brand row plus a swipeable row of section tabs */}
      <header className="lg:hidden sticky top-0 z-40 bg-royal text-white shadow-md">
        <div className="flex items-center justify-between gap-3 px-4 h-16">
          {brand}
          <button type="button" onClick={signOut} className="flex-shrink-0 min-h-[44px] px-3 text-sm font-medium text-gold">
            Sign out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto no-scrollbar px-3 pb-2" aria-label="Admin">
          {navGroups.flatMap((g) => g.items).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <NavIcon name={item.icon} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
