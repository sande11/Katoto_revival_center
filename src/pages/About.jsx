import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { team } from '../data/team';
import { beliefs } from '../data/beliefs';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — Katoto Revival Center</title>
        <meta name="description" content="Our story, vision, mission, beliefs, and leadership at Katoto Revival Center." />
      </Helmet>

      <section className="py-16 md:py-24 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Our Story" subtitle="How Katoto Revival Center began" />
          <motion.div
            className="max-w-3xl mx-auto text-charcoal leading-relaxed space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>
              Katoto Revival Center was founded in the heart of Katoto with a simple but burning vision: to see the power of revival touch lives and transform the community. What started as a small gathering of believers has grown into a family of faith where the Word is preached, the Holy Spirit is welcomed, and every person is valued.
            </p>
            <p>
              Our journey has been marked by prayer, perseverance, and the faithfulness of God. We believe that revival is not a one-time event but a lifestyle—of hunger for God, love for one another, and obedience to the Great Commission.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Vision & Mission" />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="bg-gray-50 p-6 rounded-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-xl text-royal mb-2">Vision</h3>
              <p className="text-charcoal">
                To be a church where the fire of revival never goes out—where lives are saved, healed, and discipled, and where the presence of God is the center of everything we do.
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
                To know Christ and make Him known through worship, the Word, discipleship, and love in action—in our families, community, and nation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader title="Statement of Faith" subtitle="What we believe" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {beliefs.map((b) => (
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

      <section className="py-16 section-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Leadership Team" subtitle="Meet those who serve our church" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member) => (
              <motion.article
                key={member.id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg text-royal">{member.name}</h3>
                <p className="text-gold font-medium text-sm mb-2">{member.title}</p>
                <p className="text-charcoal/80 text-sm">{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 section-light">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <SectionHeader title="Affiliations" subtitle="Denomination & partnerships" />
          <p className="text-charcoal">
            Katoto Revival Center is part of the broader Pentecostal/Revival movement. We partner with like-minded churches and organizations for missions, training, and fellowship, while remaining autonomous in local leadership and ministry.
          </p>
        </div>
      </section>
    </>
  );
}
