import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ToolPage } from './pages/ToolPage';
import { AdvancedToolPage } from './pages/AdvancedToolPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScrollToTop } from './components/ScrollToTop';
import { StoreInitializer } from './components/StoreInitializer';
import { HelmetProvider } from 'react-helmet-async';
import { YoutubeTitleGeneratorSEO } from './pages/seo/YoutubeTitleGenerator';
import { AiScriptGeneratorSEO } from './pages/seo/AiScriptGenerator';
import { ThumbnailGeneratorSEO } from './pages/seo/ThumbnailGenerator';
import { BlogList } from './pages/blog/BlogList';
import { BlogPost } from './pages/blog/BlogPost';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <StoreInitializer>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tools/:id" element={<ToolPage />} />
              <Route path="advanced/:id" element={<AdvancedToolPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="privacy-policy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="terms-of-service" element={<TermsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="youtube-title-generator" element={<YoutubeTitleGeneratorSEO />} />
              <Route path="ai-script-generator" element={<AiScriptGeneratorSEO />} />
              <Route path="thumbnail-generator" element={<ThumbnailGeneratorSEO />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreInitializer>
    </HelmetProvider>
  </StrictMode>,
);
