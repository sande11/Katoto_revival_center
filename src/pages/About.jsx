import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { aboutContent } from '../data/aboutContent';
import { useContent } from '../utils/content';
import { resolveImage } from '../utils/images';

export default function About() {
  const { data: aboutRows } = useContent('about_content');
  const { data: managedBeliefs } = useContent('beliefs');
  const { data: managedTeam } = useContent('team_members');
  const content = aboutRows[0] ?? aboutContent;
  return (
    <>
      <Helmet>
        <title>About Us — Katoto Revival Center</title>
        <meta name="description" content="Our story, vision, mission, beliefs, and leadership at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-24 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title={content.story_title} subtitle="How Katoto Revival Center began" />
          <motion.div
            className="max-w-3xl mx-auto text-charcoal leading-relaxed space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>
              {content.story_first_paragraph}
            </p>
            <p>
              {content.story_second_paragraph}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Vision & Mission" />
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            <motion.div
              className="bg-gray-50 p-6 rounded-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-xl text-royal mb-2">Vision</h3>
              <p className="text-charcoal">
                {content.vision}
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 p-6 rounded-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-xl text-royal mb-2">Mission</h3>
              <p className="text-charcoal">
                {content.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Statement of Faith" subtitle="What we believe" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {managedBeliefs.map((b) => (
              <motion.div
                key={b.id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="font-serif text-royal font-semibold mb-2">{b.title}</h4>
                <p className="text-charcoal text-sm">{b.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Leadership Team" subtitle="Meet those who serve our church" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 max-w-6xl mx-auto">
            {managedTeam.map((member) => (
              <motion.article
                key={member.id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                  {resolveImage(member.image) ? (
                    <img src={resolveImage(member.image)} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    // No photo yet: show initials (skipping titles like "Elder" or "Sis.")
                    <span className="w-full h-full flex items-center justify-center bg-royal text-gold font-serif text-4xl" aria-hidden="true">
                      {member.name.split(' ').slice(-2).map((word) => word[0]).join('')}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg text-royal">{member.name}</h3>
                <p className="text-gold font-medium text-sm mb-2">{member.title}</p>
                <p className="text-charcoal/80 text-sm max-w-xs mx-auto">{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <SectionHeader title="Affiliations" subtitle="Denomination & partnerships" />
          <p className="text-charcoal">
            {content.affiliation}
          </p>
        </div>
      </section>
    </>
  );
}
