import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { posters } from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { mode: "default" });

const samplePosters = [
  {
    titulo: "Poster Nirvana - Nevermind",
    categoria: "Bandas",
    precio: 5000,
    imagen_url: "https://via.placeholder.com/300x400?text=Nirvana+Nevermind",
  },
  {
    titulo: "Poster The Beatles - Abbey Road",
    categoria: "Bandas",
    precio: 4500,
    imagen_url: "https://via.placeholder.com/300x400?text=Beatles+Abbey+Road",
  },
  {
    titulo: "Poster Pink Floyd - The Wall",
    categoria: "Albumes",
    precio: 5500,
    imagen_url: "https://via.placeholder.com/300x400?text=Pink+Floyd+The+Wall",
  },
  {
    titulo: "Poster Pulp Fiction",
    categoria: "Peliculas",
    precio: 3500,
    imagen_url: "https://via.placeholder.com/300x400?text=Pulp+Fiction",
  },
  {
    titulo: "Poster Inception",
    categoria: "Peliculas",
    precio: 4000,
    imagen_url: "https://via.placeholder.com/300x400?text=Inception",
  },
  {
    titulo: "Poster Marilyn Monroe",
    categoria: "Personajes",
    precio: 3000,
    imagen_url: "https://via.placeholder.com/300x400?text=Marilyn+Monroe",
  },
  {
    titulo: "Poster Michael Jordan",
    categoria: "Artistas_Deportistas",
    precio: 4500,
    imagen_url: "https://via.placeholder.com/300x400?text=Michael+Jordan",
  },
  {
    titulo: "Poster Vintage Retro",
    categoria: "Otros",
    precio: 2500,
    imagen_url: "https://via.placeholder.com/300x400?text=Vintage+Retro",
  },
  {
    titulo: "Poster Queen - Bohemian Rhapsody",
    categoria: "Bandas",
    precio: 5000,
    imagen_url: "https://via.placeholder.com/300x400?text=Queen+Bohemian",
  },
  {
    titulo: "Poster David Bowie - Ziggy Stardust",
    categoria: "Bandas",
    precio: 5500,
    imagen_url: "https://via.placeholder.com/300x400?text=David+Bowie+Ziggy",
  },
];

try {
  console.log("Insertando datos de prueba...");
  await db.insert(posters).values(samplePosters);
  console.log("✓ Datos insertados exitosamente");
} catch (error) {
  console.error("Error al insertar datos:", error);
} finally {
  await connection.end();
}
