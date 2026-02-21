/**
 * i18n config for English and French. Add more keys as needed per page.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        sermons: 'Sermons',
        events: 'Events',
        ministries: 'Ministries',
        give: 'Give',
        contact: 'Contact',
        visit: 'Plan Your Visit',
        prayer: 'Prayer',
        gallery: 'Gallery',
      },
      cta: {
        planVisit: 'Plan Your Visit',
        joinSunday: 'Join Us This Sunday',
        watchSermon: 'Watch Latest Sermon',
        learnMore: 'Learn More',
        giveNow: 'Give Now',
        submit: 'Submit',
        send: 'Send Message',
      },
      common: {
        backToTop: 'Back to Top',
        newHere: "New Here? We'd love to meet you",
        readMore: 'Read more',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        about: 'À propos',
        sermons: 'Sermons',
        events: 'Événements',
        ministries: 'Ministères',
        give: 'Donner',
        contact: 'Contact',
        visit: 'Planifier votre visite',
        prayer: 'Prière',
        gallery: 'Galerie',
      },
      cta: {
        planVisit: 'Planifier votre visite',
        joinSunday: 'Rejoignez-nous ce dimanche',
        watchSermon: 'Voir le dernier sermon',
        learnMore: 'En savoir plus',
        giveNow: 'Donner maintenant',
        submit: 'Soumettre',
        send: 'Envoyer le message',
      },
      common: {
        backToTop: 'Retour en haut',
        newHere: 'Nouveau ? Nous aimerions vous rencontrer',
        readMore: 'Lire la suite',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
