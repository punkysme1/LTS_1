
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../constants';

interface ImageCarouselProps {
  images: string[];
  altText: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada gambar untuk ditampilkan.</p>;
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <img 
          src={images[currentIndex]} 
          alt={`${altText} - Gambar ${currentIndex + 1}`} 
          className="w-full h-auto max-h-[70vh] object-contain transition-opacity duration-500 ease-in-out"
        />
      </div>
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
      <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
        Gambar {currentIndex + 1} dari {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
