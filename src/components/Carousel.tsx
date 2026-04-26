import React, { useRef } from "react";

interface CarouselProps {
  images: string[];
  altPrefix?: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, altPrefix = "Screenshot" }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    if (!trackRef.current) return;
    const amount = 300;
    trackRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-wrap">
        <div className="carousel-track">
          {[1, 2, 3].map((i) => (
            <div key={i} className="carousel-item">
              <div className="carousel-item-placeholder">🖼️</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-wrap">
      <button
        className="carousel-btn carousel-btn-prev"
        onClick={() => scroll("prev")}
        aria-label="Previous screenshot"
      >
        ‹
      </button>
      <div className="carousel-track" ref={trackRef}>
        {images.map((src, i) => (
          <div key={i} className="carousel-item">
            <img src={src} alt={`${altPrefix} ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
      <button
        className="carousel-btn carousel-btn-next"
        onClick={() => scroll("next")}
        aria-label="Next screenshot"
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;
