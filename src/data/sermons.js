/**
 * Sermon entries for Sermons page and featured sermon on Home.
 * Replace with real data or API later.
 */
import bishopPreaching from '../assets/pastors/pastor_ndebere.jpeg';
import praiseTeam from '../assets/praise-team/788034074_28220678387617820_3846632709932615591_n.jpeg';
import handsRaised from '../assets/miscellenious/556652987_1134227028759112_8645909850777201291_n.jpg';
import congregation from '../assets/miscellenious/558085996_1134197485428733_8531590517096688607_n.jpg';
import prayerTime from '../assets/mens-ministry/825273522_1106370072354742_8005794228508173963_n.jpeg';
import worshipService from '../assets/828228303_2210016379543700_6352385358198203417_n.jpeg';

export const sermonSeries = [
  'Revival Fire',
  'Walking in Faith',
  'The Holy Spirit',
  'Kingdom Living',
  'Prayer & Fasting',
  'Grace & Mercy',
];

export const sermons = [
  {
    id: '1',
    title: 'The Fire of Revival',
    speaker: 'Bishop Ndewere',
    date: '2025-02-16',
    series: 'Revival Fire',
    thumbnail: bishopPreaching,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'Understanding how revival fire transforms hearts and communities.',
  },
  {
    id: '2',
    title: 'Faith That Moves Mountains',
    speaker: 'Bishop Ndewere',
    date: '2025-02-09',
    series: 'Walking in Faith',
    thumbnail: praiseTeam,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'Building unshakeable faith in the promises of God.',
  },
  {
    id: '3',
    title: 'The Comforter Among Us',
    speaker: 'Elder Grace Wanjiru',
    date: '2025-02-02',
    series: 'The Holy Spirit',
    thumbnail: handsRaised,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'Experiencing the presence and power of the Holy Spirit.',
  },
  {
    id: '4',
    title: 'Living as Kingdom Citizens',
    speaker: 'Bishop Ndewere',
    date: '2025-01-26',
    series: 'Kingdom Living',
    thumbnail: congregation,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'Practical steps to align our lives with God\'s kingdom.',
  },
  {
    id: '5',
    title: 'When We Pray',
    speaker: 'Elder Grace Wanjiru',
    date: '2025-01-19',
    series: 'Prayer & Fasting',
    thumbnail: prayerTime,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'The power of persistent prayer and fasting.',
  },
  {
    id: '6',
    title: 'Grace for the Journey',
    speaker: 'Bishop Ndewere',
    date: '2025-01-12',
    series: 'Grace & Mercy',
    thumbnail: worshipService,
    youtubeId: 'dQw4w9WgXcQ',
    notesUrl: '#',
    description: 'Receiving and extending God\'s grace every day.',
  },
];
