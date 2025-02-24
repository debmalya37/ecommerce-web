"use client";
import { useRef, useState } from "react";

interface ImageZoomWithPopUpProps {
  src: string;
  alt: string;
  containerClassName?: string;
}

export default function ImageZoomWithPopUp({ src, alt, containerClassName = "" }: ImageZoomWithPopUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({});
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [showZoom, setShowZoom] = useState(false);

  // Settings for the lens and zoom window
  const lensSize = 100; // The lens will be 100x100px
  const zoomFactor = 2.5; // Magnification factor
  const resultSize = lensSize * zoomFactor; // Size of the zoom window

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Get the mouse position relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position the lens so that it is centered on the mouse pointer
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // Clamp the lens position so it doesn't leave the container
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > rect.width - lensSize) lensX = rect.width - lensSize;
    if (lensY > rect.height - lensSize) lensY = rect.height - lensSize;

    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      position: "absolute",
      border: "1px solid #d4d4d4",
      backgroundColor: "rgba(255,255,255,0.4)",
      pointerEvents: "none",
    });

    // Calculate the background properties for the zoom window
    const cx = zoomFactor;
    const cy = zoomFactor;
    setZoomStyle({
      backgroundImage: `url('${src}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${rect.width * cx}px ${rect.height * cy}px`,
      backgroundPosition: `-${lensX * cx}px -${lensY * cy}px`,
    });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  return (
    <div
      className={`relative ${containerClassName}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={src} alt={alt} className="w-full h-full object-contain" />
      {showZoom && <div style={lensStyle} />}
      {showZoom && containerRef.current && (
        <div
          style={{
            ...zoomStyle,
            width: `${resultSize}px`,
            height: `${resultSize}px`,
            position: "absolute",
            left: containerRef.current.offsetWidth + 10, // Place zoom window 10px to the right
            top: "0",
            border: "1px solid #ccc",
            zIndex: 9999,
            backgroundColor: "#fff",
          }}
        />
      )}
    </div>
  );
}
