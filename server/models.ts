import mongoose, { Schema, Document } from 'mongoose';

// Categorías válidas
const VALID_CATEGORIES = ['deportes', 'musica-artistas', 'famosos-personajes', 'peliculas', 'photocards', 'otros'];

// --- INTERFAZ PARA SUBCATEGORÍA ---
export interface ISubcategory extends Document {
  nombre: string;
  imagen_url: string;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- ESQUEMA PARA SUBCATEGORÍA ---
const subcategorySchema = new Schema<ISubcategory>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    imagen_url: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      enum: VALID_CATEGORIES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- INTERFAZ PARA POSTER ---
export interface IPoster extends Document {
  titulo: string;
  categoria: string;
  subcategoria_id: string;
  precio: number;
  imagen_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- ESQUEMA PARA POSTER ---
const posterSchema = new Schema<IPoster>(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      enum: VALID_CATEGORIES,
      required: true,
    },
    subcategoria_id: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    imagen_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsqueda por título
posterSchema.index({ titulo: 'text' });

// --- INTERFAZ PARA ADMIN SETTINGS ---
export interface IAdminSettings extends Document {
  passwordHash: string;
  updatedAt: Date;
}

// --- ESQUEMA PARA ADMIN SETTINGS ---
const adminSettingsSchema = new Schema<IAdminSettings>(
  {
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- MODELOS ---
export const Subcategory = mongoose.model<ISubcategory>('Subcategory', subcategorySchema);
export const Poster = mongoose.model<IPoster>('Poster', posterSchema);
export const AdminSettings = mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema);
