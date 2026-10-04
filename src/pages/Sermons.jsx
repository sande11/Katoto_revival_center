import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import SermonCard from '../components/SermonCard';
import Modal from '../components/Modal';
import { useContent } from '../utils/content';
import { formatSermonDate, parseVideoLink, todayISO } from '../utils/sermons';

function VideoEmbed({ sermon }) {
  const video = parseVideoLink(sermon.link);
  if (!video) return null;
  return (
    <iframe
      title={sermon.title}
      src={video.embedUrl}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export default function Sermons() {
  const { data: sermons, loading } = useContent('sermons');
  const [filterSeries, setFilterSeries] = useState('All');
  const [filterSpeaker, setFilterSpeaker] = useState('All');
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [page, setPage] = useState(0);
  const perPage = 6;

  // A sermon is live on its date and becomes a past sermon the next day
  const today = todayISO();
  const liveSermons = useMemo(() => sermons.filter((s) => s.date === today), [sermons, today]);
  const pastSermons = useMemo(() => sermons.filter((s) => s.date < today), [sermons, today]);

  const seriesOptions = useMemo(() => [...new Set(pastSermons.map((s) => s.series))], [pastSermons]);
  const speakers = useMemo(() => [...new Set(pastSermons.map((s) => s.speaker))], [pastSermons]);

  const filtered = useMemo(() => {
    return pastSermons.filter((s) => {
      const matchSeries = filterSeries === 'All' || s.series === filterSeries;
      const matchSpeaker = filterSpeaker === 'All' || s.speaker === filterSpeaker;
      return matchSeries && matchSpeaker;
    });
  }, [pastSermons, filterSeries, filterSpeaker]);

  const paginated = useMemo(() => {
    const start = page * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <>
      <Helmet>
        <title>Sermons — Katoto Revival Center</title>
        <meta name="description" content="Watch and listen to sermons from Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Sermons" subtitle="Messages to encourage and equip you" />

          {liveSermons.map((sermon) => (
            <motion.article
              key={sermon.id}
              className="max-w-4xl mx-auto mb-10 md:mb-12 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="aspect-video bg-gray-900">
                <VideoEmbed sermon={sermon} />
              </div>
              <div className="p-4 sm:p-6">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />
                  Live Today
                </p>
                <h2 className="font-serif text-xl sm:text-2xl text-royal mb-1">{sermon.title}</h2>
                <p className="text-charcoal/80">{sermon.speaker} &middot; {sermon.series}</p>
                {sermon.description && <p className="text-charcoal mt-2">{sermon.description}</p>}
                <a
                  href={sermon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 py-2 text-gold font-medium hover:underline"
                >
                  Open in {parseVideoLink(sermon.link)?.provider ?? 'a new tab'} ↗
                </a>
              </div>
            </motion.article>
          ))}

          <h2 className="font-serif text-2xl text-royal text-center mb-5">Past Sermons</h2>

          {/* Filters — side by side and full width on phones */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-8 md:mb-10">
            <label className="sr-only" htmlFor="filter-series">Filter by series</label>
            <select
              id="filter-series"
              value={filterSeries}
              onChange={(e) => { setFilterSeries(e.target.value); setPage(0); }}
              className="form-input px-3"
            >
              <option value="All">All series</option>
              {seriesOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="filter-speaker">Filter by speaker</label>
            <select
              id="filter-speaker"
              value={filterSpeaker}
              onChange={(e) => { setFilterSpeaker(e.target.value); setPage(0); }}
              className="form-input px-3"
            >
              <option value="All">All speakers</option>
              {speakers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {!loading && filtered.length === 0 && (
            <p className="text-center text-charcoal/70">No past sermons yet. Check back after Sunday&rsquo;s service.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <AnimatePresence mode="wait">
              {paginated.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} onWatch={setSelectedSermon} />
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2.5 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 sm:px-4 py-2 text-charcoal text-sm sm:text-base whitespace-nowrap">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2.5 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={!!selectedSermon}
        onClose={() => setSelectedSermon(null)}
        title={selectedSermon?.title}
        size="large"
      >
        {selectedSermon && (
          <>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 mb-4">
              <VideoEmbed sermon={selectedSermon} />
            </div>
            <p className="text-charcoal/80">
              {selectedSermon.speaker} &middot; {formatSermonDate(selectedSermon.date)} &middot; {selectedSermon.series}
            </p>
            {selectedSermon.description && <p className="text-charcoal mt-2">{selectedSermon.description}</p>}
          </>
        )}
      </Modal>
    </>
  );
}
