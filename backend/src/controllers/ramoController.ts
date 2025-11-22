import { Request, Response, NextFunction } from 'express';
import Ramo from '../models/Ramo'; // Importamos el modelo de Ramo

// --- Función para OBTENER TODOS los ramos ---
export const getRamos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nivel, categoria, area, prefix } = req.query;

    const filter: any = {};
    if (nivel) filter.nivel = nivel;
    if (categoria) filter.categoria = categoria;
    if (area) filter.area = area;

    // Filtro por prefijo de código (Plan Común) ignorando '_'
    if (prefix) {
      const pref = String(prefix).toUpperCase();
      // Regex: opcional '_' al inicio, luego prefijo
      filter.codigo = new RegExp(`^_?${pref}`, 'i');
    }

    const ramos = await Ramo.find(filter).sort({ codigo: 1 });
    res.json(ramos);
  } catch (error) {
    next(error);
  }
};

// --- Función para OBTENER UN SOLO ramo por su ID ---
export const getRamoById = async (req: Request, res: Response, next: NextFunction) => {

  // Intentamos obtener un ramo por su ID.
  try {
    
    // Obtenemos el ID del ramo desde la URL.
    const { id } = req.params;

    // Buscamos el ramo en la base de datos.
    const ramo = await Ramo.findById(id);

    // Si no se encuentra, retornamos un error 404.
    if (!ramo) {
      return res.status(404).json({ error: 'Ramo no encontrado' });
    }

    // Si se encuentra, la enviamos al frontend.
    res.json(ramo);
    
  // Si algo sale mal, lo pasamos al manejador de errores.
  } catch (error) {
    next(error);
  }
};

// --- Filtros disponibles (para construir UI escalonada) ---
export const getRamoFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ramos = await Ramo.find({});

    const niveles = Array.from(new Set(ramos.map(r => r.nivel).filter(Boolean)));
    const categoriasPorNivel: Record<string, string[]> = {};
    for (const r of ramos) {
      if (!r.nivel || !r.categoria) continue;
      if (!categoriasPorNivel[r.nivel]) categoriasPorNivel[r.nivel] = [];
      if (!categoriasPorNivel[r.nivel].includes(r.categoria)) categoriasPorNivel[r.nivel].push(r.categoria);
    }

    // Prefijos de Plan Común (dos primeras letras alfabéticas del código ignorando '_')
    const planComunPrefijos = Array.from(new Set(
      ramos
        .filter(r => r.nivel === 'Plan Común')
        .map(r => (r.codigo.replace(/^_/, '').substring(0,2).toUpperCase()))
    )).sort();

    // Áreas de electivos (Especialidad + categoria Electivo)
    const electivoAreas = Array.from(new Set(
      ramos
        .filter(r => r.nivel === 'Especialidad' && r.categoria === 'Electivo' && r.area)
        .map(r => r.area as string)
    )).sort();

    // Áreas de núcleo gestión
    const gestionAreas = Array.from(new Set(
      ramos
        .filter(r => r.nivel === 'Especialidad' && r.categoria === 'Núcleo Gestión' && r.area)
        .map(r => r.area as string)
    )).sort();

    res.json({
      niveles,
      categoriasPorNivel,
      planComunPrefijos,
      electivoAreas,
      gestionAreas
    });
  } catch (error) {
    next(error);
  }
};