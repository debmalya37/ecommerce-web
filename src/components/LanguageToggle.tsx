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
  const [buttonText, setButtonText] = useState("Switch to Hindi");

  useEffect(() => {
    // 1) Dynamically load Google Translate script if not present
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

    // 2) The callback to initialize the widget with limited languages
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

    // 3) Set the button text based on current "googtrans" cookie
    if (getCookie("googtrans") === "/en/hi") {
      setButtonText("Switch to English");
    } else {
      setButtonText("Switch to Hindi");
    }
  }, []);

  const toggleLanguage = () => {
    // If cookie is "/en/hi", that means it's in Hindi. Switch to English.
    if (getCookie("googtrans") === "/en/hi") {
      setCookie("googtrans", "/en/en");
      setButtonText("Switch to Hindi");
    } else {
      setCookie("googtrans", "/en/hi");
      setButtonText("Switch to English");
    }
    // Reload to let Google re-translate
    window.location.reload();
  };

  return (
    <>
      {/* The hidden div required by Google Translate. */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* 
         The button text is wrapped in a "notranslate" class 
         so that Google doesn't automatically translate it. 
      */}
      <button
        onClick={toggleLanguage}
        className="bg-blue-500 text-white px-3 py-1 rounded transition hover:bg-blue-600 notranslate"
        style={{ marginLeft: "1rem" }}
      >
        {buttonText}
      </button>

      {/* 
         CSS to hide the top banner and other Google UI elements 
         that appear by default. 
      */}
      <style jsx global>{`
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
        /* Hide the small Google icon that can appear in the bottom corner */
        .goog-te-gadget-icon {
          display: none !important;
        }
        /* Mark text as not to be translated */
        .notranslate {
          translate: no !important;
        }
      `}</style>
    </>
  );
};

export default LanguageToggle;
