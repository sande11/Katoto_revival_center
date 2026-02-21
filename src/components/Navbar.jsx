import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import logoKatoto from '../assets/logo-katoto.jpg';

const navItems = [
  { path: '/', labelKey: 'nav.home', end: true },
  { path: '/about', labelKey: 'nav.about', end: false },
  { path: '/sermons', labelKey: 'nav.sermons', end: false },
  { path: '/events', labelKey: 'nav.events', end: false },
  { path: '/ministries', labelKey: 'nav.ministries', end: false },
  { path: '/give', labelKey: 'nav.give', end: false },
  { path: '/contact', labelKey: 'nav.contact', end: false },
  { path: '/prayer', labelKey: 'nav.prayer', end: false },
  { path: '/gallery', labelKey: 'nav.gallery', end: false },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
      style={{ backgroundColor: '#002366' }}
    >
      {/* Top accent strip */}
      {/* <div className="h-1 w-full" style={{ backgroundColor: '#C5A059' }} /> */}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <img
              src={logoKatoto}
              alt="Katoto Revival Center"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
              style={{ borderColor: '#C5A059' }}
            />
            <span
              className="font-serif font-semibold leading-tight"
              style={{ color: '#ffffff', fontSize: '1.1rem' }}
            >
              Katoto Revival Center
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(({ path, labelKey, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-yellow-300 underline underline-offset-4'
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`
                }
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/visit"
              className="text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#C5A059', color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b08d47'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C5A059'; }}
            >
              {t('cta.planVisit')}
            </Link>
            <button
              type="button"
              onClick={toggleLang}
              className="text-xs font-bold border border-white/50 rounded px-2 py-1 hover:border-yellow-300 hover:text-yellow-300 transition-colors duration-200"
              style={{ color: '#ffffff' }}
              aria-label="Toggle language"
            >
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>

          {/* Mobile right actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleLang}
              className="text-xs font-bold border border-white/50 rounded px-2 py-1 text-white"
            >
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </button>
            <Link
              to="/visit"
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#C5A059', color: '#ffffff' }}
            >
              {t('cta.planVisit')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div className="py-3 flex flex-col gap-1 pb-4">
                {navItems.map(({ path, labelKey, end }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-150 ${
                        isActive
                          ? 'bg-white/15 text-yellow-300'
                          : 'text-white hover:bg-white/10 hover:text-yellow-300'
                      }`
                    }
                  >
                    {t(labelKey)}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
