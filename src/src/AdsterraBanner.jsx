import { useEffect } from "react";

const AdsterraBanner = () => {
  useEffect(() => {
    const adContainer = document.getElementById("adsterra-banner");

    if (adContainer) {
      adContainer.innerHTML = `
        <script>
          atOptions = {
            'key' : '15e5851d896154a1eaebf44ed99f8823',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        <\/script>
        <script src="https://www.highperformanceformat.com/15e5851d896154a1eaebf44ed99f8823/invoke.js"><\/script>
      `;
    }
  }, []);

  return <div id="adsterra-banner"></div>;
};

export default AdsterraBanner;
