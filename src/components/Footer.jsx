import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/events', label: 'Events' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/gallery', label: 'Gallery' },
];

const resourceLinks = [
  { to: '/give', label: 'Give / Donate' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/visit', label: 'Plan Your Visit' },
  { to: '/prayer', label: 'Prayer Requests' },
];

const socialLinks = [
  {
    href: 'https://www.facebook.com/katotorevivalcenter',
    label: 'Facebook',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    href: 'https://www.youtube.com',
    label: 'YouTube',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    href: 'https://wa.me/265998107748',
    label: 'WhatsApp',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
];

const serviceTimes = [
  { day: 'Sunday', time: 'Worship Service — 9:00 AM' },
  { day: 'Wednesday', time: 'Midweek Prayer — 5:30 PM' },
  { day: 'Friday', time: 'Youth Service — 6:00 PM' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#001a4d' }}>
      {/* Gold accent top border */}
      <div className="h-1 w-full" style={{ backgroundColor: '#C5A059' }} />

      {/* Main footer body */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl flex-shrink-0"
                style={{ backgroundColor: '#C5A059', color: '#001a4d' }}
              >
                K
              </div>
              <h3 className="font-serif font-semibold text-white text-lg leading-tight">
                Katoto Revival Center
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Experience the Power of Revival. A place where faith is alive,
              community flourishes, and lives are transformed.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C5A059'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#C5A059' }}>
              Explore
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm flex items-center gap-2 transition-colors duration-150 group"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C5A059'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    <span style={{ color: '#C5A059' }}>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 mt-6" style={{ color: '#C5A059' }}>
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm flex items-center gap-2 transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C5A059'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    <span style={{ color: '#C5A059' }}>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Service Times */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#C5A059' }}>
              Service Times
            </h4>
            <ul className="space-y-3">
              {serviceTimes.map(({ day, time }) => (
                <li key={day} className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C5A059' }}>
                    {day}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 p-3 rounded-lg text-sm"
              style={{ backgroundColor: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.3)' }}
            >
              <p className="font-semibold text-white mb-1">All are welcome!</p>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Come as you are. Experience God's love and community.
              </p>
            </div>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#C5A059' }}>
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C5A059' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Katoto, Nairobi<br />Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#C5A059' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:info@katotorevivalcenter.org"
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C5A059'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                >
                  info@katotorevivalcenter.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#C5A059' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+254700000000"
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C5A059'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                >
                  +254 700 000 000
                </a>
              </li>
            </ul>

            {/* Newsletter mini CTA */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-white uppercase tracking-wide mb-2">Stay Connected</p>
              <Link
                to="/contact"
                className="inline-block text-xs font-bold px-4 py-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#C5A059', color: '#001a4d' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b08d47'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C5A059'; }}
              >
                Contact the Church
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <p>&copy; {year} Katoto Revival Center. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://sandetechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors duration-150"
              style={{ color: '#C5A059' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#C5A059'; }}
            >
              Sande Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
