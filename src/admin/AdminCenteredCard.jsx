import logo from '../assets/logo-ag.png';
import Icon from './Icon';

/** Full-screen centered card used by the login, no-access and not-configured screens. */
export default function AdminCenteredCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal to-royal-700 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="" className="w-16 h-16 rounded-full border-2 border-gold mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Katoto Assemblies of God</p>
          <h1 className="text-2xl mt-1">{title}</h1>
          {subtitle && <p className="text-sm text-charcoal/60 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
      <a href="/" className="mt-6 inline-flex items-center gap-2 min-h-[44px] px-3 text-sm text-white/70 hover:text-white">
        <Icon name="globe" className="w-4 h-4" /> Back to the website
      </a>
    </div>
  );
}
