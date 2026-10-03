import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import logoKatoto from '../assets/logo-ag.png';
import { churchContact } from '../data/contact';

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
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

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
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          {/* Logo — name stacks onto two lines on phones and hides below 360px so the CTA always fits */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 group"
            aria-label="Katoto Revival Center — Home"
          >
            <img
              src={logoKatoto}
              alt=""
              className="w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-full object-cover flex-shrink-0 border-2"
              style={{ borderColor: '#C5A059' }}
            />
            <span
              className="hidden xs:block font-serif font-bold leading-tight tracking-wide text-[0.95rem] sm:text-xl sm:whitespace-nowrap"
              style={{ color: '#C5A059', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
            >
              Katoto <br className="sm:hidden" />Revival Center
            </span>
          </Link>

          {/* Desktop nav links (xl+ — nine links plus the CTA don't fit at lg) */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map(({ path, labelKey, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
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

          {/* Right actions */}
          <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0">
            <Link
              to="/visit"
              className="inline-flex items-center whitespace-nowrap text-xs sm:text-sm font-bold h-10 px-3 sm:px-4 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#C5A059', color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b08d47'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C5A059'; }}
            >
              {t('cta.planVisit')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="xl:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
            >
              {/* Scrolls on its own when the list is taller than a short/landscape screen */}
              <div className="max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {navItems.map(({ path, labelKey, end }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end={end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-base font-semibold rounded-md transition-colors duration-150 ${
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

                {/* One-tap contact for phones */}
                <div className="grid grid-cols-2 gap-3 pt-3 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <a
                    href={`tel:${churchContact.phone}`}
                    className="flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us
                  </a>
                  <a
                    href={churchContact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
