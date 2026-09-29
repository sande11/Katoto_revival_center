/**
 * Upcoming and past events. Swap with real data or CMS later.
 */
import sundayWorship from '../assets/miscellenious/556652987_1134227028759112_8645909850777201291_n.jpg';
import youthNight from '../assets/youth-ministry/754715092_1374930421269614_2495762859748928217_n.jpeg';
import womensFellowship from '../assets/womens-ministry/672459115_1290723613109452_5822741719014811197_n.jpg';
import celebrationChoir from '../assets/praise-team/808441188_1398827708499200_6338416092175165285_n.jpeg';
import choirSinging from '../assets/praise-team/800797079_2653013788501839_935930877774437652_n.jpeg';
import congregation from '../assets/miscellenious/558085996_1134197485428733_8531590517096688607_n.jpg';
import youthGathering from '../assets/youth-ministry/758280765_1278774971979773_6651522326989693423_n.jpeg';
import revivalPreaching from '../assets/pastors/557548427_1134196495428832_2284982002425171160_n.jpg';
import churchFamily from '../assets/miscellenious/557606817_1134227145425767_819096869259929581_n.jpg';
import womenWorship from '../assets/womens-ministry/673882966_1290723293109484_4876700520184820452_n.jpg';

export const upcomingEvents = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: '2025-02-23',
    time: '9:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for praise, worship, and the Word. All are welcome.',
    image: sundayWorship,
    rsvpLink: '/visit',
  },
  {
    id: '2',
    title: 'Youth Night — Ignite',
    date: '2025-02-28',
    time: '6:00 PM',
    location: 'Youth Hall',
    description: 'An evening of worship, fellowship, and teaching for ages 13–25.',
    image: youthNight,
    rsvpLink: '/contact',
  },
  {
    id: '3',
    title: 'Women\'s Fellowship Breakfast',
    date: '2025-03-01',
    time: '8:00 AM',
    location: 'Fellowship Hall',
    description: 'Monthly gathering for women to connect, pray, and grow together.',
    image: womensFellowship,
    rsvpLink: '/contact',
  },
  {
    id: '4',
    title: 'Easter Celebration',
    date: '2025-04-20',
    time: '10:00 AM',
    location: 'Main Sanctuary & Grounds',
    description: 'Resurrection Sunday service followed by family activities and lunch.',
    image: celebrationChoir,
    rsvpLink: '/visit',
  },
];

export const pastEvents = [
  {
    id: 'p1',
    title: 'Christmas Carol Night',
    date: '2024-12-21',
    image: choirSinging,
  },
  {
    id: 'p2',
    title: 'Harvest Thanksgiving',
    date: '2024-11-30',
    image: congregation,
  },
  {
    id: 'p3',
    title: 'Youth Camp',
    date: '2024-10-15',
    image: youthGathering,
  },
  {
    id: 'p4',
    title: 'Revival Week',
    date: '2024-09-08',
    image: revivalPreaching,
  },
  {
    id: 'p5',
    title: 'Community Outreach',
    date: '2024-08-20',
    image: churchFamily,
  },
  {
    id: 'p6',
    title: 'Baptism Service',
    date: '2024-07-14',
    image: womenWorship,
  },
];
