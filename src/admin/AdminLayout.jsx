import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo-ag.png';
import { useAdminAuth } from './auth';
import FeedbackProvider from './FeedbackProvider';
import Icon from './Icon';
import { useInboxCounts } from './useInboxCounts';

// Inbox first (things waiting for a reply), then what appears on the site, then settings
const navGroups = [
  { items: [{ to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true }] },
  {
    title: 'Inbox',
    items: [
      { to: '/admin/messages', label: 'Messages', icon: 'inbox', count: 'messages' },
      { to: '/admin/prayer', label: 'Prayer requests', icon: 'heart', count: 'prayer' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/sermons', label: 'Sermons', icon: 'sermons' },
      { to: '/admin/events', label: 'Events', icon: 'calendar' },
      { to: '/admin/ministries', label: 'Ministries', icon: 'ministries' },
      { to: '/admin/service-times', label: 'Service times', icon: 'clock' },
      { to: '/admin/about', label: 'About page', icon: 'book' },
      { to: '/admin/give', label: 'Giving', icon: 'give' },
    ],
  },
  { title: 'Settings', items: [{ to: '/admin/contact', label: 'Church details', icon: 'building' }] },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-sm transition-colors ${
    isActive ? 'bg-white/15 text-white font-semibold [&>svg]:text-gold' : 'text-white/75 font-medium hover:bg-white/10 hover:text-white'
  }`;

function Brand({ onClick }) {
  return (
    <Link to="/admin" onClick={onClick} className="flex items-center gap-3 min-w-0">
      <img src={logo} alt="" className="w-10 h-10 rounded-full border-2 border-gold flex-shrink-0 bg-white" />
      <span className="min-w-0 leading-tight">
        <span className="block font-serif font-bold text-gold truncate">Katoto AG</span>
        <span className="block text-[0.7rem] uppercase tracking-widest text-white/60">Admin dashboard</span>
      </span>
    </Link>
  );
}

function SidebarContent({ counts, user, signOut, onNavigate }) {
  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Admin">
        {navGroups.map((group, i) => (
          <div key={i}>
            {group.title && (
              <p className="px-3 mb-2 text-[0.7rem] font-semibold uppercase tracking-widest text-white/45">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const count = item.count ? counts[item.count] : 0;
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onNavigate}>
                    <Icon name={item.icon} />
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="rounded-full bg-gold text-royal text-xs font-bold min-w-[1.5rem] px-1.5 py-0.5 text-center">
                        {count}
                        <span className="sr-only"> waiting</span>
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className={linkClass({ isActive: false })}>
          <Icon name="globe" />
          <span className="flex-1">View website</span>
          <Icon name="external" className="w-4 h-4 opacity-60" />
        </a>
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="w-8 h-8 rounded-full bg-gold text-royal font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase" aria-hidden="true">
            {user?.email?.[0] ?? '?'}
          </span>
          <span className="flex-1 min-w-0 text-sm text-white/70 truncate" title={user?.email}>{user?.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-white/70 hover:text-gold hover:bg-white/10"
            aria-label="Sign out"
            title="Sign out"
          >
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();
  const counts = useInboxCounts();
  const [menuOpen, setMenuOpen] = useState(false);
  const waiting = counts.messages + counts.prayer;

  // Phone menu: lock page scroll behind it and close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const sidebarProps = { counts, user, signOut };

  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Admin — Katoto Assemblies of God</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-royal text-white">
          <div className="px-5 h-[72px] flex items-center border-b border-white/10">
            <Brand />
          </div>
          <SidebarContent {...sidebarProps} />
        </aside>

        {/* Phone / tablet top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-royal text-white shadow-md">
          <div className="flex items-center gap-2 px-2 h-14">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10"
              aria-label={waiting ? `Open menu, ${waiting} waiting in inbox` : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="admin-menu"
            >
              <Icon name="menu" className="w-6 h-6" />
              {waiting > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gold ring-2 ring-royal" aria-hidden="true" />}
            </button>
            <Brand />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10"
              aria-label="View website"
            >
              <Icon name="globe" />
            </a>
          </div>
        </header>

        {/* Phone / tablet slide-out menu */}
        <div className={`lg:hidden fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`} inert={!menuOpen}>
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="admin-menu"
            aria-label="Admin menu"
            className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-royal text-white shadow-2xl transition-transform duration-200 ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="px-4 h-14 flex items-center justify-between gap-2 border-b border-white/10">
              <Brand onClick={() => setMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg hover:bg-white/10"
                aria-label="Close menu"
              >
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent {...sidebarProps} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>

        <main className="lg:pl-64">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 pb-24">
            <Outlet context={{ counts }} />
          </div>
        </main>
      </div>
    </FeedbackProvider>
  );
}
