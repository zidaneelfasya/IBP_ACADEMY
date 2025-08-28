import React, { useEffect, ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Helmet } from 'react-helmet';

// Definisikan interface untuk props
interface SEOWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

// Perluas interface Window untuk include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({ 
  children, 
  title, 
  description, 
  image, 
  canonical 
}) => {
  const { url } = usePage();
  const siteUrl = 'https://academy.ibpub.org/'; // Ganti dengan domain Anda
  const fullUrl = siteUrl + url;
  
  useEffect(() => {
    // Kirim event ke Google Analytics (jika ada)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: fullUrl,
        page_path: url,
      });
    }
  }, [title, fullUrl, url]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical || fullUrl} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image || `${siteUrl}/default-image.jpg`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={fullUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image || `${siteUrl}/default-image.jpg`} />
      </Head>
      
      {/* Structured Data untuk SEO */}
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Industrial Business Project Academy",
              "alternateName": "IBP Academy",
              "url": "${siteUrl}",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "${siteUrl}/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>
      
      {children}
    </>
  );
};

export default SEOWrapper;