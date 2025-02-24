// src/components/ImageZoom.tsx
"use client";
import { useRef, useState } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  containerClassName?: string;
}

export default function ImageZoom({ src, alt, containerClassName = "" }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({});
  const [resultStyle, setResultStyle] = useState<React.CSSProperties>({});
  const [showZoom, setShowZoom] = useState(false);

  // These settings can be tuned as needed.
  const lensSize = 100; // Lens width/height in pixels
  const resultSize = 300; // Result div width/height in pixels

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { top, left, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    // Calculate lens position; center the lens on the mouse
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // Prevent the lens from going outside the image
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > width - lensSize) lensX = width - lensSize;
    if (lensY > height - lensSize) lensY = height - lensSize;

    // Calculate the zoom ratio (resultSize divided by lensSize)
    const cx = resultSize / lensSize;
    const cy = resultSize / lensSize;

    // Update lens style
    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      position: "absolute",
      border: "1px solid #d4d4d4",
      backgroundColor: "rgba(255,255,255,0.4)",
      cursor: "none",
    });

    // Update the result div style to show the zoomed portion
    setResultStyle({
      backgroundImage: `url('${src}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${width * cx}px ${height * cy}px`,
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
      {showZoom && (
        <div
          style={{
            ...resultStyle,
            width: `${resultSize}px`,
            height: `${resultSize}px`,
            position: "absolute",
            top: "0",
            right: "-320px",
            border: "1px solid #ccc",
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}
