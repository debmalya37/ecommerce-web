"use client";
import { useRef, useState } from "react";

interface ImageZoomWithPopupProps {
  src: string;
  alt: string;
  containerClassName?: string;
  zoomLevel?: number; // e.g., 2 means 200%
}

export default function ImageZoomWithPopup({
  src,
  alt,
  containerClassName = "",
  zoomLevel = 2,
}: ImageZoomWithPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    setBackgroundPosition(`${xPercent}% ${yPercent}%`);
  };

  return (
    <div
      className={`relative ${containerClassName}`}
      ref={containerRef}
      onMouseEnter={() => setShowZoom(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img src={src} alt={alt} className="w-full h-full object-contain" />
      {showZoom && (
        <div
          style={{
            width: "200px",
            height: "200px",
            position: "absolute",
            top: "0",
            left: "105%",
            border: "1px solid #ccc",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
            backgroundPosition: backgroundPosition,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
}
