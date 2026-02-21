/**
 * Gallery images by category. Uses Unsplash church/worship themed placeholders.
 */
const baseImages = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507680434567-5739c80be1aa?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=500&fit=crop',
];

export const galleryCategories = ['All', 'Services', 'Events', 'Outreach', 'Youth'];

export const galleryImages = [
  { id: '1', src: baseImages[0], category: 'Services', title: 'Sunday Worship' },
  { id: '2', src: baseImages[1], category: 'Services', title: 'Praise & Worship' },
  { id: '3', src: baseImages[2], category: 'Youth', title: 'Youth Night' },
  { id: '4', src: baseImages[3], category: 'Events', title: 'Harvest Thanksgiving' },
  { id: '5', src: baseImages[4], category: 'Services', title: 'Sermon' },
  { id: '6', src: baseImages[5], category: 'Outreach', title: 'Community Visit' },
  { id: '7', src: baseImages[6], category: 'Events', title: 'Christmas Carols' },
  { id: '8', src: baseImages[7], category: 'Youth', title: 'Children\'s Ministry' },
  { id: '9', src: baseImages[8], category: 'Outreach', title: 'Mission Trip' },
  { id: '10', src: baseImages[9], category: 'Events', title: 'Baptism' },
  { id: '11', src: baseImages[10], category: 'Services', title: 'Prayer Meeting' },
  { id: '12', src: baseImages[11], category: 'Youth', title: 'Youth Camp' },
];
