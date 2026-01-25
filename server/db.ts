import mongoose from 'mongoose';
import { Poster, AdminSettings, Subcategory } from './models';
import { ENV } from './_core/env';


let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[MongoDB] MONGODB_URI no está configurado');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}



export async function upsertUser(user: any): Promise<void> {
  console.log('[MongoDB] upsertUser llamado (no implementado)');
}

export async function getUserByOpenId(openId: string) {
  return {
    id: 1,
    openId: openId,
    name: 'Admin',
    email: null,
    loginMethod: null,
    role: 'admin' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}



export async function getAllSubcategories() {
  await connectDB();
  try {
    const result = await Subcategory.find().sort({ createdAt: -1 }).lean();
    return result.map(s => ({
      id: s._id.toString(),
      nombre: s.nombre,
      imagen_url: s.imagen_url,
      categoria: s.categoria,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo subcategorías:', error);
    return [];
  }
}

export async function getSubcategoriesByCategory(categoria: string) {
  await connectDB();
  try {
    const result = await Subcategory.find({ categoria }).sort({ createdAt: -1 }).lean();
    return result.map(s => ({
      id: s._id.toString(),
      nombre: s.nombre,
      imagen_url: s.imagen_url,
      categoria: s.categoria,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo subcategorías por categoría:', error);
    return [];
  }
}

export async function createSubcategory(data: {
  nombre: string;
  imagen_url: string;
  categoria: string;
}) {
  await connectDB();
  try {
    const subcategory = new Subcategory(data);
    const saved = await subcategory.save();
    return {
      id: saved._id.toString(),
      nombre: saved.nombre,
      imagen_url: saved.imagen_url,
      categoria: saved.categoria,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error creando subcategoría:', error);
    throw error;
  }
}

export async function updateSubcategory(
  id: string,
  data: Partial<{
    nombre: string;
    imagen_url: string;
    categoria: string;
  }>
) {
  await connectDB();
  try {
    const updated = await Subcategory.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) return null;
    return {
      id: updated._id.toString(),
      nombre: updated.nombre,
      imagen_url: updated.imagen_url,
      categoria: updated.categoria,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error actualizando subcategoría:', error);
    return null;
  }
}

export async function deleteSubcategory(id: string) {
  await connectDB();
  try {

    await Poster.deleteMany({ subcategoria_id: id });
    await Subcategory.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error('[MongoDB] Error eliminando subcategoría:', error);
    return false;
  }
}

export async function getSubcategoryById(id: string) {
  await connectDB();
  try {
    const subcategory = await Subcategory.findById(id).lean();
    if (!subcategory) return null;
    return {
      id: subcategory._id.toString(),
      nombre: subcategory.nombre,
      imagen_url: subcategory.imagen_url,
      categoria: subcategory.categoria,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error obteniendo subcategoría:', error);
    return null;
  }
}



export async function getAllPosters() {
  await connectDB();
  try {
    const result = await Poster.find().sort({ createdAt: -1 }).lean();
    return result.map(p => ({
      id: p._id.toString(),
      titulo: p.titulo,
      categoria: p.categoria,
      subcategoria_id: p.subcategoria_id,
      precio: p.precio,
      imagen_url: p.imagen_url,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo posters:', error);
    return [];
  }
}

export async function getPostersBySubcategory(subcategoria_id: string) {
  await connectDB();
  try {
    const result = await Poster.find({ subcategoria_id }).sort({ createdAt: -1 }).lean();
    return result.map(p => ({
      id: p._id.toString(),
      titulo: p.titulo,
      categoria: p.categoria,
      subcategoria_id: p.subcategoria_id,
      precio: p.precio,
      imagen_url: p.imagen_url,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo posters por subcategoría:', error);
    return [];
  }
}

export async function getPostersByCategory(categoria: string) {
  await connectDB();
  try {
    const result = await Poster.find({ categoria }).sort({ createdAt: -1 }).lean();
    return result.map(p => ({
      id: p._id.toString(),
      titulo: p.titulo,
      categoria: p.categoria,
      subcategoria_id: p.subcategoria_id,
      precio: p.precio,
      imagen_url: p.imagen_url,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo posters por categoría:', error);
    return [];
  }
}

export async function getLatestPosters(limit: number = 10) {
  await connectDB();
  try {
    const result = await Poster.find().sort({ createdAt: -1 }).limit(limit).lean();
    return result.map(p => ({
      id: p._id.toString(),
      titulo: p.titulo,
      categoria: p.categoria,
      subcategoria_id: p.subcategoria_id,
      precio: p.precio,
      imagen_url: p.imagen_url,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error obteniendo últimos posters:', error);
    return [];
  }
}

export async function createPoster(data: {
  titulo: string;
  categoria: string;
  subcategoria_id: string;
  precio: number;
  imagen_url: string;
}) {
  await connectDB();
  try {
    const poster = new Poster(data);
    const saved = await poster.save();
    return {
      id: saved._id.toString(),
      titulo: saved.titulo,
      categoria: saved.categoria,
      subcategoria_id: saved.subcategoria_id,
      precio: saved.precio,
      imagen_url: saved.imagen_url,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error creando poster:', error);
    throw error;
  }
}

export async function updatePoster(
  id: string,
  data: Partial<{
    titulo: string;
    categoria: string;
    subcategoria_id: string;
    precio: number;
    imagen_url: string;
  }>
) {
  await connectDB();
  try {
    const updated = await Poster.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) return null;
    return {
      id: updated._id.toString(),
      titulo: updated.titulo,
      categoria: updated.categoria,
      subcategoria_id: updated.subcategoria_id,
      precio: updated.precio,
      imagen_url: updated.imagen_url,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error actualizando poster:', error);
    return null;
  }
}

export async function deletePoster(id: string) {
  await connectDB();
  try {
    await Poster.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error('[MongoDB] Error eliminando poster:', error);
    return false;
  }
}

export async function getPosterById(id: string) {
  await connectDB();
  try {
    const poster = await Poster.findById(id).lean();
    if (!poster) return null;
    return {
      id: poster._id.toString(),
      titulo: poster.titulo,
      categoria: poster.categoria,
      subcategoria_id: poster.subcategoria_id,
      precio: poster.precio,
      imagen_url: poster.imagen_url,
      createdAt: poster.createdAt,
      updatedAt: poster.updatedAt,
    };
  } catch (error) {
    console.error('[MongoDB] Error obteniendo poster:', error);
    return null;
  }
}



export async function searchPosters(query: string) {
  await connectDB();
  try {
    const regex = new RegExp(query, 'i');
    const result = await Poster.find({ titulo: regex }).sort({ createdAt: -1 }).limit(20).lean();
    return result.map(p => ({
      id: p._id.toString(),
      titulo: p.titulo,
      categoria: p.categoria,
      subcategoria_id: p.subcategoria_id,
      precio: p.precio,
      imagen_url: p.imagen_url,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('[MongoDB] Error buscando posters:', error);
    return [];
  }
}

export async function getSearchSuggestions(query: string) {
  await connectDB();
  try {
    const regex = new RegExp('^' + query, 'i');
    const posters = await Poster.find({ titulo: regex }).select('titulo').limit(10).lean();
    const subcategories = await Subcategory.find({ nombre: regex }).select('nombre').limit(5).lean();

    const suggestions: string[] = [];
    posters.forEach(p => {
      if (!suggestions.includes(p.titulo)) {
        suggestions.push(p.titulo);
      }
    });
    subcategories.forEach(s => {
      if (!suggestions.includes(s.nombre)) {
        suggestions.push(s.nombre);
      }
    });

    return suggestions.slice(0, 10);
  } catch (error) {
    console.error('[MongoDB] Error obteniendo sugerencias:', error);
    return [];
  }
}



export async function getAdminPassword(): Promise<string | null> {
  await connectDB();
  try {
    const settings = await AdminSettings.findOne().lean();
    return settings?.passwordHash || null;
  } catch (error) {
    console.error('[MongoDB] Error obteniendo contraseña admin:', error);
    return null;
  }
}

export async function setAdminPassword(passwordHash: string): Promise<boolean> {
  await connectDB();
  try {
    const existing = await AdminSettings.findOne();
    if (existing) {
      existing.passwordHash = passwordHash;
      await existing.save();
    } else {
      const settings = new AdminSettings({ passwordHash });
      await settings.save();
    }
    return true;
  } catch (error) {
    console.error('[MongoDB] Error guardando contraseña admin:', error);
    return false;
  }
}
