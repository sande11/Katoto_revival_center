import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Ministries from './pages/Ministries';
import Give from './pages/Give';
import Contact from './pages/Contact';
import Visit from './pages/Visit';
import Prayer from './pages/Prayer';
import Gallery from './pages/Gallery';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/events" element={<Events />} />
              <Route path="/ministries" element={<Ministries />} />
              <Route path="/give" element={<Give />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/visit" element={<Visit />} />
              <Route path="/prayer" element={<Prayer />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <BackToTop />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
