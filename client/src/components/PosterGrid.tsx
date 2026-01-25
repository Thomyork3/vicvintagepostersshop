import { useState } from "react";
import { Poster } from "@shared/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageLightbox } from "./ImageLightbox";

interface PosterGridProps {
  posters: Poster[];
  isLoading?: boolean;
}

export function PosterGrid({ posters, isLoading }: PosterGridProps) {
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full aspect-[3/4]" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        ))}
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay posters disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posters.map((poster) => (
          <Card
            key={poster.id}
            className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
            onClick={() => setSelectedPoster(poster)}
          >
            {}
            <div
              className="aspect-[3/4] overflow-hidden bg-gray-100 relative"
              onContextMenu={(e) => e.preventDefault()}
            >
              {}
              <div className="absolute inset-0 z-10 bg-transparent" />

              <img
                src={poster.imagen_url}
                alt={poster.titulo}
                className="w-full h-full object-cover hover:scale-105 transition-transform select-none pointer-events-none"
                draggable={false}
              />

              {}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors z-20 flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm font-medium">
                  Click para ampliar
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{poster.titulo}</h3>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-gray-500 uppercase">{poster.categoria}</span>
                <span className="font-bold text-lg">${(poster.precio / 100).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {}
      {selectedPoster && (
        <ImageLightbox
          imageUrl={selectedPoster.imagen_url}
          title={selectedPoster.titulo}
          isOpen={!!selectedPoster}
          onClose={() => setSelectedPoster(null)}
        />
      )}
    </>
  );
}
