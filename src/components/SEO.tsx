import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  url?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title,
  description,
  keywords = 'ai tools, creator productivity, ai script generator, ai thumbnail, best ai tools for youtubers',
  ogType = 'website',
  ogImage = 'https://ai-create-pi.vercel.app/og-image.png',
  url = 'https://ai-create-pi.vercel.app',
  schema,
}: SEOProps) {
  const finalTitle = `${title} | CreatorAI Musab`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CreatorAI Musab" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL for SEO Indexing */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
