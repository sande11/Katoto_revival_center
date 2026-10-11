import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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

// Admin dashboard is its own chunk so visitors never download it
const AdminApp = lazy(() => import('./admin/AdminApp'));

function SiteLayout() {
  return (
    <>
      {/* overflow-x-clip stops slide-in animations from causing sideways scroll on phones (clip keeps the sticky navbar working) */}
      <div className="min-h-screen flex flex-col overflow-x-clip">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
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
          </Route>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
                <AdminApp />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
