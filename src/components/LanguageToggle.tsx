"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

// Remove all variants of the googtrans cookie (with different domains/paths)
function removeAllGoogTransCookies() {
  // The main cookie removal
  document.cookie = "googtrans=; path=/; max-age=0;";

  // Attempt to remove with domain variations if any
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  // e.g. ["www", "example", "com"]
  // Try progressively shorter domains: "example.com", "com"
  for (let i = 0; i < domainParts.length; i++) {
    const domain = domainParts.slice(i).join(".");
    document.cookie = `googtrans=; domain=${domain}; path=/; max-age=0;`;
    document.cookie = `googtrans=; domain=.${domain}; path=/; max-age=0;`;
  }
}

// Set a single googtrans cookie with path="/"
function setGoogTransCookie(value: string) {
  // Remove any existing cookies
  removeAllGoogTransCookies();
  // Now set the new cookie
  document.cookie = `googtrans=${value}; path=/;`;
}

// Helper to read the current googtrans cookie
function getGoogTransCookie(): string {
  const match = document.cookie.match(/(^| )googtrans=([^;]+)/);
  return match ? match[2] : "";
}

const LanguageToggle: React.FC = () => {
  // isHindi: true means the page is currently translated to Hindi
  const [isHindi, setIsHindi] = useState(false);

  useEffect(() => {
    // Check if "googtrans" is "/en/hi" -> means site is in Hindi
    if (getGoogTransCookie() === "/en/hi") {
      setIsHindi(true);
    } else {
      setIsHindi(false);
    }

    // Dynamically load Google Translate script if not present
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi", // Only English & Hindi
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLanguage = () => {
    // Toggle between "/en/hi" and "/en/en"
    if (isHindi) {
      // Currently in Hindi, switch to English
      setGoogTransCookie("/en/en");
      setIsHindi(false);
    } else {
      // Currently in English, switch to Hindi
      setGoogTransCookie("/en/hi");
      setIsHindi(true);
    }
    // Short delay to ensure the cookie is updated, then reload
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <>
      {/* Hidden element required by Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
      {/* Animated Toggle Switch */}
      <button
        onClick={toggleLanguage}
        className="relative inline-flex items-center h-8 w-16 bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300"
      >
        <span
          className={`bg-blue-600 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isHindi ? "translate-x-8" : "translate-x-0"
          }`}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 select-none">
          {isHindi ? "HI" : "EN"}
        </span>
      </button>
      <style jsx global>{`
        .notranslate {
          translate: no !important;
        }
        .goog-te-banner-frame.skiptranslate,
        .goog-te-menu-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-text-highlight {
          display: none !important;
          box-shadow: none !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default LanguageToggle;
