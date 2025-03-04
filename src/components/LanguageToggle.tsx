"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

// Utility functions to get/set cookies
function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || "" : "";
}

function setCookie(name: string, value: string) {
  // You can add expiry or domain settings here if needed.
  document.cookie = `${name}=${value}; path=/;`;
}

const LanguageToggle: React.FC = () => {
  // isHindi: true means page is currently translated to Hindi
  const [isHindi, setIsHindi] = useState(false);

  useEffect(() => {
    // Check cookie on mount to see if translation is set to Hindi
    if (getCookie("googtrans") === "/en/hi") {
      setIsHindi(true);
    } else {
      setIsHindi(false);
    }

    // Load Google Translate script if it's not already loaded
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
          includedLanguages: "en,hi",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLanguage = () => {
    // Toggle the cookie value and update state
    if (isHindi) {
      setCookie("googtrans", "/en/en");
      setIsHindi(false);
    } else if  (isHindi === false) {
      setCookie("googtrans", "/hi/hi");
      setIsHindi(true);
    } else {
      setCookie("googtrans", "/en/en");
      setIsHindi(false);
    }
    // Wait a short moment to ensure cookie is set, then reload
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <>
      {/* Required hidden element by Google Translate */}
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
        ></span>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 select-none">
          {isHindi ? "HI" : "EN"}
        </span>
      </button>
      <style jsx global>{`
        .notranslate {
          translate: no !important;
        }
        /* Hide Google Translate banner and tooltips */
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
