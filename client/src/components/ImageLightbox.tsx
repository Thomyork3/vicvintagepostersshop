import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
  imageUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, title, isOpen, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X className="w-8 h-8" />
      </button>

      {}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {}
        <div className="absolute inset-0 z-10" />

        {}
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[90vh] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">
        {title}
      </div>
    </div>
  );
}
