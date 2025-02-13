import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/home/HomePage';
import { MenuPage } from './components/menu/MenuPage';
import { ShowsPage } from './components/shows/ShowsPage';
import { GalleryPage } from './components/gallery/GalleryPage';
import { ClubPage } from './components/club/ClubPage';
import { BookingPage } from './components/booking/BookingPage';
import { ContactPage } from './components/contact/ContactPage';
import { AboutPage } from './components/about/AboutPage';
import { BlogPage } from './components/blog/BlogPage';
import { FAQPage } from './components/faq/FAQPage';
import { RecruitmentPage } from './components/recruitment/RecruitmentPage';
import { Dashboard } from './components/admin/Dashboard';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const [currentPage, setCurrentPage] = React.useState(() => {
    const hash = window.location.hash.slice(1) || 'home';
    return hash;
  });

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
        
        <main>
          {currentPage === 'admin' ? (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ) : (
            <>
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'menu' && <MenuPage />}
              {currentPage === 'shows' && <ShowsPage />}
              {currentPage === 'gallery' && <GalleryPage />}
              {currentPage === 'club' && <ClubPage />}
              {currentPage === 'booking' && <BookingPage />}
              {currentPage === 'contact' && <ContactPage />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'blog' && <BlogPage />}
              {currentPage === 'faq' && <FAQPage />}
              {currentPage === 'recruitment' && <RecruitmentPage />}
            </>
          )}
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;