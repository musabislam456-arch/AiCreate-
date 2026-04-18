import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Prevent reloading on re-renders if already injected
    if (doc.getElementById('ad-injected')) return;

    // We write the ad network code into the iframe document to safely execute document.write 
    // which is commonly used by Adsterra, thereby protecting the React top-level DOM.
    const adHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              overflow: hidden; 
              background: transparent; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
            }
          </style>
        </head>
        <body>
          <div id="ad-injected">
            <script type="text/javascript">
              atOptions = {
                'key' : '15e5851d896154a1eaebf44ed99f8823',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/15e5851d896154a1eaebf44ed99f8823/invoke.js"></script>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(adHtml);
    doc.close();
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-10 py-4 bg-muted/10 rounded-xl">
      <iframe
        ref={iframeRef}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        title="Advertisement"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        className="block mx-auto"
      />
    </div>
  );
}
