import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import MinistryCard from '../components/MinistryCard';
import { ministries } from '../data/ministries';

export default function Ministries() {
  return (
    <>
      <Helmet>
        <title>Ministries — Katoto Revival Center</title>
        <meta name="description" content="Youth, Women, Men, Children, Prayer, Outreach, and Worship at Katoto Revival Center." />
      </Helmet>

      <section className="py-12 md:py-16 section-light">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Ministries"
            subtitle="There is a place for everyone to belong and serve"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ministries.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
