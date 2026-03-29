import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, X, ZoomIn } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogClose } from './ui/dialog';

export const ImageGallery = ({ images, vehicleName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[selectedIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vehicleName}-${selectedIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setLightboxOpen(false);
  };

  return (
    <div className="flex flex-col gap-4" data-testid="image-gallery">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 group">
        <img
          src={images[selectedIndex]}
          alt={`${vehicleName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
          data-testid="gallery-main-image"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="gallery-prev-btn"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="gallery-next-btn"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setLightboxOpen(true)}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            data-testid="gallery-zoom-btn"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            data-testid="gallery-download-btn"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-lg">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div 
          className="grid grid-cols-4 gap-4"
          data-testid="gallery-thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 transition-all ${
                index === selectedIndex 
                  ? 'ring-2 ring-orange-500 ring-offset-2' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              data-testid={`gallery-thumbnail-${index}`}
            >
              <img
                src={image}
                alt={`${vehicleName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[selectedIndex]}
              alt={`${vehicleName} - Image ${selectedIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              data-testid="lightbox-image"
            />
            
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
              <X className="w-6 h-6" />
            </DialogClose>

            {/* Navigation in Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-lg">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
