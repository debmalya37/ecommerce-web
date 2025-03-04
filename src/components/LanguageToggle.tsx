"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || "" : "";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/;`;
}

const LanguageToggle: React.FC = () => {
  // isHindi: true means the page is currently translated to Hindi
  const [isHindi, setIsHindi] = useState(false);

  useEffect(() => {
    // On mount, check if the "googtrans" cookie is set to Hindi ("/en/hi")
    if (getCookie("googtrans") === "/en/hi") {
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
          includedLanguages: "en,hi", // Only English and Hindi
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLanguage = () => {
    // When toggling, use the correct cookie values:
    // "/en/hi" for Hindi and "/en/en" for English.
    if (isHindi) {
      setCookie("googtrans", "/en/en");
      setIsHindi(false);
    } else {
      setCookie("googtrans", "/en/hi");
      setIsHindi(true);
    }
    // Wait a short moment to ensure the cookie is set, then reload.
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
        ></span>
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
