import React, { useState, useEffect, useRef } from 'react';
import { PerformanceMonitor } from './monitor';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
}

export function LazyImage({ src, alt, placeholder, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    performanceMonitor.measureApiCall('image-load', performance.now());
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    performanceMonitor.logError(new Error(`Image load failed: ${src}`));
  };

  return (
    <div className="relative" ref={imgRef}>
      <img
        src={isInView ? src : placeholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}