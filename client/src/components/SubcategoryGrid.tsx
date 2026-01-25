import { Subcategory } from "@shared/types";

interface SubcategoryGridProps {
  subcategories: Subcategory[];
  isLoading: boolean;
  onSelect: (subcategory: Subcategory) => void;
}

export function SubcategoryGrid({ subcategories, isLoading, onSelect }: SubcategoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg" />
            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay subcategorías en esta categoría
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          onClick={() => onSelect(subcategory)}
          className="cursor-pointer group"
        >
          {}
          <div
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            onContextMenu={(e) => e.preventDefault()}
          >
            {}
            <div className="absolute inset-0 z-10 bg-transparent" />

            <img
              src={subcategory.imagen_url}
              alt={subcategory.nombre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
              draggable={false}
            />

            {}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-20" />
          </div>

          {}
          <h3 className="mt-3 text-lg font-semibold text-center text-gray-800 group-hover:text-blue-600 transition-colors">
            {subcategory.nombre}
          </h3>
        </div>
      ))}
    </div>
  );
}
