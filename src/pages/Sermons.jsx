import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import SermonCard from '../components/SermonCard';
import Modal from '../components/Modal';
import { sermons, sermonSeries } from '../data/sermons';

export default function Sermons() {
  const [filterSeries, setFilterSeries] = useState('All');
  const [filterSpeaker, setFilterSpeaker] = useState('All');
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [page, setPage] = useState(0);
  const perPage = 6;

  const speakers = useMemo(() => {
    const set = new Set(sermons.map((s) => s.speaker));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return sermons.filter((s) => {
      const matchSeries = filterSeries === 'All' || s.series === filterSeries;
      const matchSpeaker = filterSpeaker === 'All' || s.speaker === filterSpeaker;
      return matchSeries && matchSpeaker;
    });
  }, [filterSeries, filterSpeaker]);

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
              {sermonSeries.map((s) => (
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
              {speakers.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All speakers' : s}</option>
              ))}
            </select>
          </div>

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
              <iframe
                title={selectedSermon.title}
                src={`https://www.youtube.com/embed/${selectedSermon.youtubeId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-charcoal/80">
              {selectedSermon.speaker} &middot; {new Date(selectedSermon.date).toLocaleDateString('en-US')} &middot; {selectedSermon.series}
            </p>
            <p className="text-charcoal mt-2">{selectedSermon.description}</p>
            {selectedSermon.notesUrl && (
              <a
                href={selectedSermon.notesUrl}
                className="inline-block mt-2 py-2 text-gold font-medium hover:underline"
              >
                Download sermon notes
              </a>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
