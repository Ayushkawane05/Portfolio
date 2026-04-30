import { lazy, Suspense, useEffect, useState } from 'react';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Navbar from './components/layout/Navbar';
import EducationOverlay from './components/sections/EducationOverlay';

// Admin route — code-split, never in public bundle
const AdminPage = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

function App() {
  const [data, setData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);

  useEffect(() => {
    // Check if we are on the admin path
    if (window.location.pathname.startsWith('/admin')) {
      setIsAdmin(true);
    }

    // Hydrate or Fetch data
    if ((window as any).__INITIAL_DATA__) {
      setData((window as any).__INITIAL_DATA__);
    } else {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content`)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error('Failed to load content:', err));
    }
  }, []);

  // Lock scroll when overlay is active
  useEffect(() => {
    if (selectedEducation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedEducation]);

  if (window.location.pathname === '/admin/login') {
    return (
      <Suspense fallback={<div className="bg-pixel-bg min-h-screen text-pixel-primary p-12 font-pixel">LOADING_AUTH_MODULE...</div>}>
        <AdminLogin />
      </Suspense>
    );
  }

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="bg-pixel-bg min-h-screen text-pixel-primary p-12 font-pixel">LOADING_SYSTEM...</div>}>
        <AdminPage />
      </Suspense>
    );
  }

  // Public site — all sections rendered statically
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About bio={data?.profile?.bio} avatarUrl={data?.profile?.avatarUrl} />
        <Skills skills={data?.skills} />
        <Education 
          items={data?.education} 
          onSelect={(item) => setSelectedEducation(item)}
        />
        <Experience items={data?.experience} />
        <Achievements items={data?.achievements} />
        <Projects items={data?.projects} />
        <Contact contact={data?.profile?.contact} />
      </main>

      {selectedEducation && (
        <EducationOverlay 
          item={selectedEducation} 
          onClose={() => setSelectedEducation(null)} 
        />
      )}
    </>
  );
}

export default App;
