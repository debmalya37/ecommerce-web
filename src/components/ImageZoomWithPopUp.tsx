"use client";
import { useRef, useState, CSSProperties } from "react";

interface ImageZoomWithPopUpProps {
  src: string;
  alt: string;
  containerClassName?: string;
}

export default function ImageZoomWithPopUp({
  src,
  alt,
  containerClassName = "",
}: ImageZoomWithPopUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lens + zoom states
  const [lensStyle, setLensStyle] = useState<CSSProperties>({});
  const [zoomStyle, setZoomStyle] = useState<CSSProperties>({});
  const [showZoom, setShowZoom] = useState(false);

  // Lens & zoom sizing
  const lensSize = 120; // The lens will be 120×120 px
  const zoomFactor = 2.5; // Magnification factor
  const resultSize = 300; // Zoom window dimension (300×300 px)

  /**
   * Handle mouse movement over the main image container
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Mouse coordinates relative to container top-left
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position lens so that the mouse is at its center
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // Clamp lens so it never leaves the container
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > rect.width - lensSize) lensX = rect.width - lensSize;
    if (lensY > rect.height - lensSize) lensY = rect.height - lensSize;

    // The lens is basically a highlight on the main image
    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      position: "absolute",
      border: "1px solid #ccc",
      backgroundColor: "rgba(255,255,255,0.4)",
      cursor: "crosshair",
      pointerEvents: "none",
    });

    // Calculate background-size & position for the zoom window
    const cx = zoomFactor;
    const cy = zoomFactor;

    setZoomStyle({
      backgroundImage: `url('${src}')`,
      backgroundRepeat: "no-repeat",
      // The size of the background is rect.width/height × zoomFactor
      backgroundSize: `${rect.width * cx}px ${rect.height * cy}px`,
      // Move the background so it lines up with the lens
      backgroundPosition: `-${lensX * cx}px -${lensY * cy}px`,
      width: `${resultSize}px`,
      height: `${resultSize}px`,
      border: "1px solid #ccc",
      backgroundColor: "#fff",
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
      style={{ position: "relative" }}
    >
      {/* Main Image */}
      <img src={src} alt={alt} className="w-full h-full object-contain" />

      {/* Lens Overlay (on top of main image) */}
      {showZoom && <div style={lensStyle} />}

      {/* Zoom Popup: placed to the right of container */}
      {showZoom && (
        <div
          style={{
            ...zoomStyle,
            position: "absolute",
            top: 0,
            left: (containerRef.current?.offsetWidth || 0) + 10, // 10px gap to the right
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}
