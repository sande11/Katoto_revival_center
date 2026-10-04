import logo from '../assets/logo-ag.png';

/** Full-screen centered card used by the login, no-access and not-configured screens. */
export default function AdminCenteredCard({ title, children }) {
  return (
    <div className="min-h-screen bg-royal flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="" className="w-16 h-16 rounded-full border-2 border-gold mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Katoto Revival Center</p>
          <h1 className="text-2xl mt-1">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
