// Este archivo ya no se usa - la aplicación usa MongoDB con Mongoose
// Los esquemas están definidos en server/models.ts

// Tipos de compatibilidad para el sistema
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export type InsertUser = Partial<User> & { openId: string };

export type Poster = {
  id: string;
  titulo: string;
  categoria: 'Albumes' | 'Bandas' | 'Peliculas' | 'Personajes' | 'Artistas_Deportistas' | 'Photocards' | 'Otros';
  precio: number;
  imagen_url: string;
  createdAt: Date;
  updatedAt: Date;
};
