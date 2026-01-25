/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Categorías principales actualizadas
export const CATEGORIES = [
  { id: "deportes", label: "Deportes" },
  { id: "musica-artistas", label: "Música/Artistas" },
  { id: "famosos-personajes", label: "Famosos/Personajes" },
  { id: "peliculas", label: "Películas" },
  { id: "photocards", label: "Photocards" },
  { id: "otros", label: "Otros" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

// Tipo para Subcategoría
export interface Subcategory {
  id: string;
  nombre: string;
  imagen_url: string;
  categoria: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo para Poster/Imagen (ahora pertenece a una subcategoría)
export interface Poster {
  id: string;
  titulo: string;
  imagen_url: string;
  precio: number;
  subcategoria_id: string;
  categoria: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo para resultados de búsqueda
export interface SearchResult {
  id: string;
  titulo: string;
  imagen_url: string;
  tipo: "poster" | "subcategoria";
  categoria?: string;
}
