/**
 * Ministry list for Ministries page. Update with real leaders and schedules.
 */
import youthMinistry from '../assets/youth-ministry/556648250_1134197515428730_3899871776711072794_n.jpg';
import womensFellowship from '../assets/womens-ministry/509719573_1058574962990986_7921665953125148302_n.jpg';
import mensFellowship from '../assets/mens-ministry/555683360_1134197908762024_2321877765068401350_n.jpg';
import childrensMinistry from '../assets/children-ministry/682593563_1297017799146700_6106475829369747874_n.jpg';
import prayerMinistry from '../assets/miscellenious/556652987_1134227028759112_8645909850777201291_n.jpg';
import outreachCommunity from '../assets/miscellenious/557823259_1134197408762074_6849635619622513725_n.jpg';
import worshipTeam from '../assets/praise-team/800797079_2653013788501839_935930877774437652_n.jpeg';

export const ministries = [
  {
    id: '1',
    name: 'Youth Ministry',
    slug: 'youth',
    description: 'We disciple young people (13–25) through worship, Bible study, and fellowship so they grow as leaders and followers of Christ.',
    leader: 'Bro. David Kimani',
    schedule: 'Fridays, 6:00 PM',
    icon: 'youth',
    image: youthMinistry,
  },
  {
    id: '2',
    name: 'Women\'s Fellowship',
    slug: 'women',
    description: 'A safe space for women to pray, study the Word, and support one another in faith and life.',
    leader: 'Sis. Grace Wanjiru',
    schedule: 'First Saturday of each month, 8:00 AM',
    icon: 'women',
    image: womensFellowship,
  },
  {
    id: '3',
    name: 'Men\'s Fellowship',
    slug: 'men',
    description: 'Men gathering to grow in godliness, accountability, and service to family and church.',
    leader: 'Elder James Otieno',
    schedule: 'Second Saturday of each month, 7:00 AM',
    icon: 'men',
    image: mensFellowship,
  },
  {
    id: '4',
    name: 'Children\'s Ministry',
    slug: 'children',
    description: 'Age-appropriate teaching, worship, and activities so children discover Jesus in a fun, safe environment.',
    leader: 'Sis. Mary Njeri',
    schedule: 'Sundays during main service',
    icon: 'children',
    image: childrensMinistry,
  },
  {
    id: '5',
    name: 'Prayer Ministry',
    slug: 'prayer',
    description: 'Intercession for the church, community, and nations. We meet to pray and also support prayer requests.',
    leader: 'Elder Grace Wanjiru',
    schedule: 'Wednesdays, 5:30 PM & Sundays before service',
    icon: 'prayer',
    image: prayerMinistry,
  },
  {
    id: '6',
    name: 'Outreach & Community',
    slug: 'outreach',
    description: 'Taking the love of Christ beyond our walls through evangelism, visits, and community projects.',
    leader: 'Bro. Peter Mburu',
    schedule: 'As scheduled (monthly outreaches)',
    icon: 'outreach',
    image: outreachCommunity,
  },
  {
    id: '7',
    name: 'Worship Team',
    slug: 'worship',
    description: 'Leading the congregation in praise and worship through music and song.',
    leader: 'Sis. Ruth Akinyi',
    schedule: 'Rehearsals: Saturdays 2:00 PM; Service: Sundays',
    icon: 'worship',
    image: worshipTeam,
  },
];
