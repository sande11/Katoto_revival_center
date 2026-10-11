import { useState } from 'react';
import Icon from './Icon';
import { Avatar, Badge, EmptyState, ErrorNote, FilterTabs, ListSkeleton, PageHeader, SearchInput } from './ui';
import { useAdminList } from './useAdminList';
import { formatDateTime, timeAgo } from './format';

const statusOf = (request) => {
  if (!request.share_public) return 'private';
  return request.approved_at ? 'published' : 'awaiting';
};

const statusBadge = {
  awaiting: <Badge tone="gold">Awaiting approval</Badge>,
  published: <Badge tone="green">On prayer wall</Badge>,
  private: <Badge>Private</Badge>,
};

const emptyText = {
  awaiting: 'No shared requests are waiting to be published.',
  published: 'Nothing is on the prayer wall yet.',
  private: 'No private requests.',
  all: 'Prayer requests sent through the website will appear here.',
};

export default function PrayerAdmin() {
  const list = useAdminList('prayer_requests', {
    noun: 'prayer request',
    nameOf: (r) => r.name || 'Anonymous',
    deleteMessage: (r) => `The prayer request from ${r.name || 'an anonymous visitor'} will be permanently deleted${r.approved_at ? ' and removed from the prayer wall' : ''}.`,
  });
  const [filter, setFilter] = useState(null);
  const [query, setQuery] = useState('');

  const byStatus = (status) => list.rows.filter((r) => statusOf(r) === status);
  const awaiting = byStatus('awaiting');
  // Open on the approval queue when something is waiting
  const activeFilter = filter ?? (awaiting.length ? 'awaiting' : 'all');
  const needle = query.trim().toLowerCase();
  const shown = (activeFilter === 'all' ? list.rows : byStatus(activeFilter)).filter(
    (r) => !needle || [r.name, r.email, r.request].some((text) => text?.toLowerCase().includes(needle)),
  );

  const setPublished = (request, publish) => {
    setFilter(activeFilter);
    return list.update(
      (q) => q.update({ approved_at: publish ? new Date().toISOString() : null }).eq('id', request.id),
      publish ? 'Published to the prayer wall' : 'Removed from the prayer wall',
    );
  };

  return (
    <>
      <PageHeader
        title="Prayer requests"
        description="Requests sent through the Prayer page. Ones the visitor chose to share appear on the public prayer wall only after you publish them."
      />
      <ErrorNote>{list.error}</ErrorNote>

      {list.rows.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
          <FilterTabs
            label="Show prayer requests"
            value={activeFilter}
            onChange={setFilter}
            options={[
              { value: 'awaiting', label: 'Awaiting approval', count: awaiting.length },
              { value: 'published', label: 'Published', count: byStatus('published').length },
              { value: 'private', label: 'Private', count: byStatus('private').length },
              { value: 'all', label: 'All', count: list.rows.length },
            ]}
          />
          <div className="lg:ml-auto lg:w-64">
            <SearchInput value={query} onChange={setQuery} placeholder="Search requests" label="Search prayer requests" />
          </div>
        </div>
      )}

      {list.loading && <ListSkeleton rows={3} media="round" />}

      {!list.loading && !list.error && shown.length === 0 && (
        <EmptyState
          icon={activeFilter === 'awaiting' && list.rows.length ? 'checkCircle' : 'heart'}
          title={needle ? 'No matching requests' : activeFilter === 'awaiting' && list.rows.length ? 'All caught up' : undefined}
          action={activeFilter !== 'all' && list.rows.length > 0 && (
            <button type="button" onClick={() => setFilter('all')} className="btn-secondary btn-sm">Show all requests</button>
          )}
        >
          {needle ? `Nothing matches “${query}”.` : emptyText[activeFilter]}
        </EmptyState>
      )}

      {shown.length > 0 && (
        <ul className="space-y-3">
          {shown.map((request) => {
            const status = statusOf(request);
            return (
              <li
                key={request.id}
                className={`rounded-xl border p-4 sm:p-5 ${status === 'awaiting' ? 'bg-gold-50/60 border-gold-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={request.name || '?'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold text-royal">{request.name || 'Anonymous'}</p>
                      {statusBadge[status]}
                      <time className="ml-auto text-xs text-charcoal/50" dateTime={request.created_at} title={formatDateTime(request.created_at)}>
                        {timeAgo(request.created_at)}
                      </time>
                    </div>
                    {request.email && <p className="text-sm text-charcoal/70 break-all">{request.email}</p>}
                    <p className="mt-3 text-charcoal whitespace-pre-wrap break-words">{request.request}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {status === 'awaiting' && (
                        <button type="button" onClick={() => setPublished(request, true)} className="btn-primary btn-sm">
                          <Icon name="globe" className="w-4 h-4" /> Publish to prayer wall
                        </button>
                      )}
                      {status === 'published' && (
                        <button type="button" onClick={() => setPublished(request, false)} className="btn-secondary btn-sm">
                          <Icon name="eyeSlash" className="w-4 h-4" /> Remove from prayer wall
                        </button>
                      )}
                      {request.email && (
                        <a
                          href={`mailto:${request.email}?subject=${encodeURIComponent('Praying with you — Katoto Assemblies of God')}`}
                          className="btn-secondary btn-sm"
                        >
                          <Icon name="mail" className="w-4 h-4" /> Reply by email
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => list.remove(request)}
                        className="inline-flex items-center gap-2 min-h-[40px] px-3.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Icon name="trash" className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
