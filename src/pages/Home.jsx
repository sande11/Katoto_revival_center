import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bishopNdewere from '../assets/bishop-ndewere.jpg';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import CTABanner from '../components/CTABanner';
import { sermons } from '../data/sermons';
import { upcomingEvents } from '../data/events';
import { testimonials } from '../data/testimonials';
import { ministries } from '../data/ministries';

const featuredSermon = sermons[0];

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Katoto Revival Center — Experience the Power of Revival</title>
        <meta name="description" content="Katoto Revival Center. Join us for worship, Word, and community. Experience the power of revival." />
      </Helmet>

      {/* Hero: deep blue overlay per Trust & Tradition */}
      <section
        className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 35, 102, 0.85) 0%, rgba(0, 35, 102, 0.7) 100%), url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop)`,
        }}
      >
        <div className="container mx-auto px-4 text-left max-w-4xl">
          <motion.p
            className="text-sm md:text-base uppercase tracking-wider text-white mb-2 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Church Love, Faith Love
          </motion.p>
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Welcome To Our Church
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Katoto Revival Center is a place where you can experience the power of revival. We are a family of believers committed to the Word, worship, and the work of the Holy Spirit.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to="/visit"
              className="inline-block bg-gold text-white font-semibold px-8 py-3 rounded-lg hover:bg-gold-500 transition-colors text-center"
            >
              {t('cta.joinSunday')}
            </Link>
            <Link
              to="/sermons"
              className="inline-block bg-white/10 backdrop-blur border-2 border-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              {t('cta.watchSermon')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating card: Join Sunday Live Stream style */}
      <section className="relative z-10 -mt-12 md:-mt-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 aspect-video md:aspect-auto md:min-h-[200px] bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop"
                  alt="Worship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="font-serif text-2xl text-royal mb-2">Join the Sunday Live Stream</h2>
                <p className="text-charcoal/80 mb-4">Every Sunday at 9:00 AM. Join us in person or online.</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/visit"
                    className="inline-block bg-gold text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-gold-500 transition-colors"
                  >
                    Join Now
                  </Link>
                  <Link
                    to="/sermons"
                    className="inline-block border-2 border-royal text-royal font-semibold px-5 py-2.5 rounded-lg hover:bg-royal/5 transition-colors"
                  >
                    Past Messages
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services: two-column layout */}
      <section className="py-16 md:py-20 section-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
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
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {ministries.slice(0, 6).map((m) => (
                <Link
                  key={m.id}
                  to="/ministries"
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl mb-2 block" aria-hidden="true">
                    {m.icon === 'youth' ? '👥' : m.icon === 'women' ? '💜' : m.icon === 'men' ? '👔' : m.icon === 'children' ? '👶' : m.icon === 'prayer' ? '🙏' : '✝️'}
                  </span>
                  <h3 className="font-serif text-royal font-semibold group-hover:text-gold transition-colors">{m.name}</h3>
                  <p className="text-charcoal/70 text-sm mt-1 line-clamp-2">{m.description}</p>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome from Pastor */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-300 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={bishopNdewere}
                alt="Bishop Ndewere"
                className="w-full h-full object-cover"
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
      <section className="py-16 section-white">
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

      {/* Current Series / Featured sermons - card grid */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-sm uppercase tracking-wider text-royal font-medium mb-2">Current Series</p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-royal mb-3">
              Hope for Tomorrow
            </h2>
            <p className="text-charcoal/80">
              Messages to encourage and equip you in faith.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sermons.slice(0, 3).map((s) => (
              <motion.article
                key={s.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video bg-gray-200">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-gold font-medium text-xs uppercase tracking-wide mb-1">{s.series} | Past Messages</p>
                  <h3 className="font-serif text-lg text-royal mb-1">{s.title}</h3>
                  <p className="text-charcoal/70 text-sm mb-2">Posted on {new Date(s.date).toLocaleDateString('en-US')}</p>
                  <Link to="/sermons" className="text-royal font-medium text-sm hover:text-gold transition-colors">
                    Listen to the message →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/sermons" className="text-royal font-medium hover:text-gold transition-colors">
              View all sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Upcoming Events" subtitle="Join us for these gatherings" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/events" className="text-royal font-medium hover:text-gold transition-colors">
              View all events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="What People Say" subtitle="Stories from our congregation" />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
