/**
 * Gallery images, loaded from the photo folders in src/assets.
 * Drop a new .jpg/.jpeg into a folder and it appears under that category automatically.
 */
// Vite requires the glob options to be written inline on every call
const sources = [
  {
    category: 'Services',
    title: 'Church Service',
    files: import.meta.glob(['../assets/miscellenious/*.{jpg,jpeg}', '../assets/pastors/*.{jpg,jpeg}', '../assets/828228303_*.jpeg'], { eager: true, import: 'default' }),
  },
  { category: 'Praise & Worship', title: 'Praise Team', files: import.meta.glob('../assets/praise-team/*.{jpg,jpeg}', { eager: true, import: 'default' }) },
  { category: 'Youth', title: 'Youth Ministry', files: import.meta.glob('../assets/youth-ministry/*.{jpg,jpeg}', { eager: true, import: 'default' }) },
  { category: 'Children', title: "Children's Ministry", files: import.meta.glob('../assets/children-ministry/*.{jpg,jpeg}', { eager: true, import: 'default' }) },
  { category: "Men's", title: "Men's Fellowship", files: import.meta.glob('../assets/mens-ministry/*.{jpg,jpeg}', { eager: true, import: 'default' }) },
  { category: "Women's", title: "Women's Fellowship", files: import.meta.glob('../assets/womens-ministry/*.{jpg,jpeg}', { eager: true, import: 'default' }) },
];

// A few photos have better titles than their folder's default
const titleOverrides = {
  'church_pic.jpeg': 'Our Church',
};

export const galleryCategories = ['All', ...sources.map((s) => s.category)];

// The same photo appears in more than one folder, so skip repeats by file name
const seen = new Set();
export const galleryImages = sources.flatMap(({ category, title, files }) =>
  Object.entries(files)
    .map(([path, src]) => ({ file: path.split('/').pop(), src }))
    .filter(({ file }) => !seen.has(file) && seen.add(file))
    .map(({ file, src }) => ({ id: file, src, category, title: titleOverrides[file] || title }))
);
