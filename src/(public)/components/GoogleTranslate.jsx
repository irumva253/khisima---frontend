import { useEffect } from 'react';

const GoogleTranslate = ({ language }) => {
  useEffect(() => {
    // Only proceed if we have a language selected and it's not English
    if (language && language !== 'en') {
      // Check if Google Translate script is already loaded
      if (!window.google || !window.google.translate) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      // Initialize the translation element
      window.googleTranslateElementInit = () => {
        if (!window.google || !window.google.translate) {
          console.error('Google Translate API not loaded');
          return;
        }

        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,fr,rw,sw', // English, French, Kinyarwanda, Swahili
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');

        // Programmatically change the language
        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            select.value = language;
            select.dispatchEvent(new Event('change'));
          } else {
            console.error('Google Translate dropdown not found');
          }
        }, 500);
      };

      // If Google Translate is already loaded, initialize immediately
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }

      return () => {
        // Cleanup function
        const googleTranslateElement = document.querySelector('.goog-te-combo');
        if (googleTranslateElement) {
          googleTranslateElement.remove();
        }
        const iframes = document.querySelectorAll('iframe[src*="translate.google"]');
        iframes.forEach(iframe => iframe.remove());
      };
    }
  }, [language]);

  return <div id="google_translate_element" style={{ display: 'none' }}></div>;
};

export default GoogleTranslate;