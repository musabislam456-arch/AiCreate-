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
import { BlogHome } from './pages/blog/BlogHome';
import { BestAIToolsForYouTubers } from './pages/blog/BestAIToolsForYouTubers';
import { AIToolsForTikTokCreators } from './pages/blog/AIToolsForTikTokCreators';
import { HowAIHelpsCreatorsGoViral } from './pages/blog/HowAIHelpsCreatorsGoViral';
import { TopAIContentGenerators } from './pages/blog/TopAIContentGenerators';
import { AIForSocialMediaGrowth } from './pages/blog/AIForSocialMediaGrowth';
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
              <Route path="tool/:id" element={<ToolPage />} />
              <Route path="advanced/:id" element={<AdvancedToolPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="youtube-title-generator" element={<YoutubeTitleGeneratorSEO />} />
              <Route path="ai-script-generator" element={<AiScriptGeneratorSEO />} />
              <Route path="thumbnail-generator" element={<ThumbnailGeneratorSEO />} />
              <Route path="blog" element={<BlogHome />} />
              <Route path="blog/best-ai-tools-for-youtubers" element={<BestAIToolsForYouTubers />} />
              <Route path="blog/ai-tools-for-tiktok-creators" element={<AIToolsForTikTokCreators />} />
              <Route path="blog/how-ai-helps-creators-go-viral" element={<HowAIHelpsCreatorsGoViral />} />
              <Route path="blog/top-ai-content-generators" element={<TopAIContentGenerators />} />
              <Route path="blog/ai-for-social-media-growth" element={<AIForSocialMediaGrowth />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreInitializer>
    </HelmetProvider>
  </StrictMode>,
);
