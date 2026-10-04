import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bishopNdewere from '../assets/bishop-ndewere.jpg';
import sundayCongregation from '../assets/miscellenious/556285033_1134227065425775_4024409936295275959_n.jpg';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import CTABanner from '../components/CTABanner';
import { testimonials } from '../data/testimonials';
import { ministryEmoji } from '../data/ministries';
import { useContent } from '../utils/content';
import { formatSermonDate, parseVideoLink, sermonThumbnail, todayISO } from '../utils/sermons';

// Phones get a smaller portrait crop of the hero photo to save mobile data
const heroOverlay = 'linear-gradient(135deg, rgba(0, 35, 102, 0.85) 0%, rgba(0, 35, 102, 0.7) 100%)';
const heroPhoto = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7';

export default function Home() {
  const { t } = useTranslation();
  const { data: sermons, loading: sermonsLoading } = useContent('sermons');
  const { data: ministries } = useContent('ministries');
  const { data: serviceTimes } = useContent('service_times');
  const { data: events } = useContent('events');

  // Today's sermon fills the live-stream card; on other days the most recent past sermon does
  const today = todayISO();
  const liveSermon = sermons.find((s) => s.date === today);
  const pastSermons = sermons.filter((s) => s.date < today);
  const featuredSermon = liveSermon ?? pastSermons[0];
  const mainService = serviceTimes[0];

  return (
    <>
      <Helmet>
        <title>Katoto Revival Center — Experience the Power of Revival</title>
        <meta name="description" content="Katoto Revival Center. Join us for worship, Word, and community. Experience the power of revival." />
      </Helmet>

      {/* Hero: deep blue overlay per Trust & Tradition */}
      {/* On phones the hero sizes to its content instead of a fixed share of the screen */}
      <section
        className="relative sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-cover bg-center text-white pt-10 pb-20 sm:pt-12 sm:pb-24 md:py-28 bg-[image:var(--hero-bg-sm)] md:bg-[image:var(--hero-bg-lg)]"
        style={{
          '--hero-bg-sm': `${heroOverlay}, url(${heroPhoto}?w=800&h=1000&fit=crop&q=70)`,
          '--hero-bg-lg': `${heroOverlay}, url(${heroPhoto}?w=1920&h=1080&fit=crop)`,
        }}
      >
        <div className="container mx-auto px-4 text-left max-w-4xl">
          <motion.p
            className="text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] sm:tracking-wider text-white/90 mb-2 sm:mb-3 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Church Love, Faith Love
          </motion.p>
          <motion.h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-3 sm:mb-4 text-white drop-shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Welcome to
            <span className="block text-gold">Katoto Revival Center</span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 mb-6 sm:mb-8 max-w-2xl drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            A place where you can experience the power of revival. We are a family of believers committed to the Word, worship, and the work of the Holy Spirit.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* py-3 vs py-2.5 + border-2 keeps both buttons the same height (44px phones, 48px sm+) */}
            <Link
              to="/visit"
              className="inline-block bg-gold text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 rounded-lg hover:bg-gold-500 transition-colors text-center"
            >
              {t('cta.joinSunday')}
            </Link>
            <Link
              to="/sermons"
              className="inline-block bg-white/10 backdrop-blur border-2 border-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-2.5 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              {t('cta.watchSermon')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating card: today's live stream, else the latest message, else an empty state */}
      <section className="relative z-10 -mt-12 md:-mt-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="grid md:grid-cols-5 gap-0">
              <div className={`md:col-span-2 aspect-video md:aspect-auto md:min-h-[200px] bg-gray-200 ${sermonsLoading ? 'animate-pulse' : ''}`}>
                {!sermonsLoading && (
                  <img
                    src={featuredSermon ? sermonThumbnail(featuredSermon) : sundayCongregation}
                    alt={featuredSermon ? '' : 'Congregation worshipping at a Sunday service'}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="md:col-span-3 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                {sermonsLoading ? (
                  <div className="animate-pulse space-y-3" aria-hidden="true">
                    <div className="h-3 w-24 rounded bg-gray-200" />
                    <div className="h-7 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-11 w-44 rounded-lg bg-gray-200 !mt-5" />
                  </div>
                ) : featuredSermon ? (
                  <>
                    {liveSermon ? (
                      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />
                        Live Today
                      </p>
                    ) : (
                      <p className="text-xs font-bold uppercase tracking-wider text-gold mb-2">
                        Latest Message &middot; {formatSermonDate(featuredSermon.date)}
                      </p>
                    )}
                    <h2 className="font-serif text-xl sm:text-2xl text-royal mb-2">{featuredSermon.title}</h2>
                    <div className="mb-4">
                      <p className="text-charcoal/80">{featuredSermon.speaker} &middot; {featuredSermon.series}</p>
                      {!liveSermon && mainService && (
                        <p className="text-sm text-charcoal/60 mt-1">
                          Join us live every {mainService.day} at {mainService.time}.
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex gap-3">
                      {/* Opens YouTube / Facebook directly — on phones that's the app, which handles live video best */}
                      <a
                        href={featuredSermon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gold text-white font-semibold text-sm sm:text-base px-3 sm:px-5 py-3 sm:py-2.5 rounded-lg hover:bg-gold-500 transition-colors text-center"
                      >
                        Watch on {parseVideoLink(featuredSermon.link)?.provider ?? 'Video'}
                      </a>
                      <Link
                        to="/sermons"
                        className="inline-block border-2 border-royal text-royal font-semibold text-sm sm:text-base px-3 sm:px-5 py-2.5 sm:py-2 rounded-lg hover:bg-royal/5 transition-colors text-center whitespace-nowrap"
                      >
                        Past Messages
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="w-11 h-11 mb-3 rounded-full bg-royal/5 text-royal flex items-center justify-center" aria-hidden="true">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-royal mb-2">No sermons yet</h2>
                    <p className="text-charcoal/80 mb-4">
                      Live streams and recorded messages will appear here.{' '}
                      {mainService ? `Join us every ${mainService.day} at ${mainService.time}, in person or online.` : 'Join us in person or online.'}
                    </p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex gap-3">
                      <Link
                        to="/visit"
                        className="inline-block bg-gold text-white font-semibold text-sm sm:text-base px-3 sm:px-5 py-3 sm:py-2.5 rounded-lg hover:bg-gold-500 transition-colors text-center"
                      >
                        Plan Your Visit
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services: two-column layout */}
      <section className="py-12 md:py-20 section-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-wider text-royal font-medium mb-2">Our Services</p>
              <h2 className="font-serif text-2xl md:text-3xl text-royal mb-4">
                We Love Serving Our Local Community
              </h2>
              <p className="text-charcoal/90 mb-4">
                From weekly worship and youth programs to special events and pastoral care, we are here to serve you and your family.
              </p>
              <p className="text-charcoal/80 mb-6">
                Whatever your next step—visiting for the first time, joining a ministry, or getting connected—we would love to walk with you.
              </p>
              <Link
                to="/ministries"
                className="inline-block bg-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold-500 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {ministries.slice(0, 6).map((m) => (
                <Link
                  key={m.id}
                  to="/ministries"
                  className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-gold/30 hover:shadow-md active:bg-gray-100 transition-all group"
                >
                  <span className="text-2xl mb-2 block" aria-hidden="true">
                    {ministryEmoji(m.icon)}
                  </span>
                  <h3 className="font-serif text-[0.95rem] sm:text-base leading-snug text-royal font-semibold group-hover:text-gold transition-colors">{m.name}</h3>
                  <p className="text-charcoal/70 text-sm mt-1 line-clamp-2">{m.description}</p>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome from Pastor */}
      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
            <motion.div
              className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-300 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={bishopNdewere}
                alt="Bishop Ndewere"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-royal mb-4">A Warm Welcome</h2>
              <p className="text-charcoal leading-relaxed">
                Whether you are new to faith or have been walking with the Lord for years, you have a place here. Come as you are—we would love to meet you.
              </p>
              <p className="text-royal font-medium mt-4">— Bishop Ndewere, Senior Pastor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="py-12 md:py-16 section-white">
        <div className="container mx-auto px-4 text-center">
          <motion.blockquote
            className="font-serif text-xl md:text-2xl lg:text-3xl text-royal max-w-4xl mx-auto italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            &ldquo;To know Christ and make Him known—through worship, discipleship, and love in action.&rdquo;
          </motion.blockquote>
        </div>
      </section>

      {/* Current Series / latest past sermons - swipeable row on phones, card grid from md */}
      {pastSermons.length > 0 && (
        <section className="py-12 md:py-16 section-light">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
              <p className="text-sm uppercase tracking-wider text-royal font-medium mb-2">Current Series</p>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-royal mb-3">
                {pastSermons[0].series}
              </h2>
              <p className="text-charcoal/80">
                Messages to encourage and equip you in faith.
              </p>
            </div>
            <div className="snap-row md:grid-cols-3 max-w-5xl">
              {pastSermons.slice(0, 3).map((s) => (
                <motion.article
                  key={s.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video bg-gray-200">
                    <img src={sermonThumbnail(s)} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <p className="text-gold font-medium text-xs uppercase tracking-wide mb-1">{s.series} | Past Messages</p>
                    <h3 className="font-serif text-lg text-royal mb-1">{s.title}</h3>
                    <p className="text-charcoal/70 text-sm">Posted on {formatSermonDate(s.date, { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
                    <Link to="/sermons" className="inline-block py-2 text-royal font-medium text-sm hover:text-gold transition-colors">
                      Listen to the message →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="text-center mt-6 md:mt-8">
              <Link to="/sermons" className="inline-block px-4 py-2.5 text-royal font-medium hover:text-gold transition-colors">
                View all sermons →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      <section className="py-12 md:py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Upcoming Events" subtitle="Join us for these gatherings" />
          <div className="snap-row md:grid-cols-2 lg:grid-cols-3">
            {events.filter((event) => !event.is_past).slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link to="/events" className="inline-block px-4 py-2.5 text-royal font-medium hover:text-gold transition-colors">
              View all events →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="What People Say" subtitle="Stories from our congregation" />
          <div className="snap-row md:grid-cols-3 md:gap-8 max-w-5xl">
            {testimonials.map((item) => (
              <motion.blockquote
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-charcoal italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                <footer className="text-royal font-medium">{item.name}</footer>
                <p className="text-charcoal/70 text-sm">{item.role}</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title={t('common.newHere')}
        subtitle="Plan your first visit and we'll make you feel at home."
        buttonText={t('cta.planVisit')}
        to="/visit"
      />
    </>
  );
}
