import { useState } from 'react';
import Icon from './Icon';
import { Avatar, Badge, EmptyState, ErrorNote, FilterTabs, ListSkeleton, PageHeader, SearchInput } from './ui';
import { useAdminList } from './useAdminList';
import { formatDateTime, timeAgo } from './format';

// Opens the admin's email app with a reply that quotes the original message
function replyLink(message) {
  const quoted = message.message.length > 1000 ? `${message.message.slice(0, 1000)}…` : message.message;
  const body = `\n\n\n— On ${formatDateTime(message.created_at)}, ${message.name} wrote:\n${quoted}`;
  return `mailto:${message.email}?subject=${encodeURIComponent('Re: Your message to Katoto Assemblies of God')}&body=${encodeURIComponent(body)}`;
}

export default function MessagesAdmin() {
  const list = useAdminList('contact_messages', {
    noun: 'message',
    nameOf: (m) => m.name,
    deleteMessage: (m) => `The message from ${m.name} will be permanently deleted. This can’t be undone.`,
  });
  const [filter, setFilter] = useState(null);
  const [query, setQuery] = useState('');

  const unread = list.rows.filter((m) => !m.is_read);
  // Open on Unread when there is something new, otherwise show everything
  const activeFilter = filter ?? (unread.length ? 'unread' : 'all');
  const needle = query.trim().toLowerCase();
  const shown = (activeFilter === 'unread' ? unread : list.rows).filter(
    (m) => !needle || [m.name, m.email, m.phone, m.message].some((text) => text?.toLowerCase().includes(needle)),
  );

  const setRead = (message, isRead, announce = true) => {
    setFilter(activeFilter);
    return list.update((q) => q.update({ is_read: isRead }).eq('id', message.id), announce && (isRead ? 'Marked as read' : 'Marked as unread'));
  };

  return (
    <>
      <PageHeader title="Messages" description="Sent through the Contact page. Only signed-in admins can see them." />
      <ErrorNote>{list.error}</ErrorNote>

      {list.rows.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <FilterTabs
            label="Show messages"
            value={activeFilter}
            onChange={setFilter}
            options={[
              { value: 'unread', label: 'Unread', count: unread.length },
              { value: 'all', label: 'All', count: list.rows.length },
            ]}
          />
          <div className="sm:ml-auto sm:w-72">
            <SearchInput value={query} onChange={setQuery} placeholder="Search messages" label="Search messages" />
          </div>
        </div>
      )}

      {list.loading && <ListSkeleton rows={3} media="round" />}

      {!list.loading && !list.error && shown.length === 0 && (
        <EmptyState
          icon={list.rows.length ? 'checkCircle' : 'inbox'}
          title={needle ? 'No matching messages' : list.rows.length ? 'All caught up' : 'No messages yet'}
          action={activeFilter === 'unread' && list.rows.length > 0 && (
            <button type="button" onClick={() => setFilter('all')} className="btn-secondary btn-sm">Show all messages</button>
          )}
        >
          {needle ? `Nothing matches “${query}”.` : list.rows.length ? 'Every message has been read.' : 'Messages sent through the Contact page will appear here.'}
        </EmptyState>
      )}

      {shown.length > 0 && (
        <ul className="space-y-3">
          {shown.map((message) => (
            <li
              key={message.id}
              className={`rounded-xl border p-4 sm:p-5 ${message.is_read ? 'bg-white border-gray-200' : 'bg-gold-50/60 border-gold-200'}`}
            >
              <div className="flex items-start gap-3">
                <Avatar name={message.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-semibold text-royal">{message.name}</p>
                    {!message.is_read && <Badge tone="gold">New</Badge>}
                    <time className="ml-auto text-xs text-charcoal/50" dateTime={message.created_at} title={formatDateTime(message.created_at)}>
                      {timeAgo(message.created_at)}
                    </time>
                  </div>
                  <p className="text-sm text-charcoal/70 break-all">
                    {message.email}
                    {message.phone && <> &middot; {message.phone}</>}
                  </p>
                  <p className="mt-3 text-charcoal whitespace-pre-wrap break-words">{message.message}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={replyLink(message)}
                      onClick={() => !message.is_read && setRead(message, true, false)}
                      className="btn-primary btn-sm"
                    >
                      <Icon name="mail" className="w-4 h-4" /> Reply by email
                    </a>
                    {message.phone && (
                      <a href={`tel:${message.phone}`} className="btn-secondary btn-sm">
                        <Icon name="phone" className="w-4 h-4" /> Call
                      </a>
                    )}
                    <button type="button" onClick={() => setRead(message, !message.is_read)} className="btn-secondary btn-sm">
                      <Icon name={message.is_read ? 'mail' : 'mailOpen'} className="w-4 h-4" />
                      {message.is_read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => list.remove(message)}
                      className="inline-flex items-center gap-2 min-h-[40px] px-3.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Icon name="trash" className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
