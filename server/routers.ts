import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllPosters,
  getPostersByCategory,
  getPostersBySubcategory,
  getLatestPosters,
  createPoster,
  updatePoster,
  deletePoster,
  getAdminPassword,
  setAdminPassword,
  getAllSubcategories,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  searchPosters,
  getSearchSuggestions
} from "./db";
import { hashPassword, verifyPassword } from "./auth-utils";

const VALID_CATEGORIES = ["deportes", "musica-artistas", "famosos-personajes", "peliculas", "photocards", "otros"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),


  subcategories: router({
    getAll: publicProcedure.query(() => getAllSubcategories()),
    getByCategory: publicProcedure
      .input(z.object({ categoria: z.string() }))
      .query(({ input }) => getSubcategoriesByCategory(input.categoria)),
    create: publicProcedure
      .input(
        z.object({
          nombre: z.string().min(1),
          imagen_url: z.string().url(),
          categoria: z.enum(VALID_CATEGORIES),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { password, ...subcategoryData } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          const newHash = await hashPassword(password);
          await setAdminPassword(newHash);
        } else {
          const isValid = await verifyPassword(password, storedHash);
          if (!isValid) {
            throw new Error("Contraseña incorrecta");
          }
        }

        return createSubcategory(subcategoryData);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          nombre: z.string().min(1).optional(),
          imagen_url: z.string().url().optional(),
          categoria: z.enum(VALID_CATEGORIES).optional(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password, ...updateData } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          throw new Error("No hay contraseña de administrador configurada");
        }

        const isValid = await verifyPassword(password, storedHash);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return updateSubcategory(id, updateData);
      }),
    delete: publicProcedure
      .input(
        z.object({
          id: z.string(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          throw new Error("No hay contraseña de administrador configurada");
        }

        const isValid = await verifyPassword(password, storedHash);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        const success = await deleteSubcategory(id);
        return { success };
      }),
  }),


  posters: router({
    getAll: publicProcedure.query(() => getAllPosters()),
    getByCategory: publicProcedure
      .input(z.object({ categoria: z.string() }))
      .query(({ input }) => getPostersByCategory(input.categoria)),
    getBySubcategory: publicProcedure
      .input(z.object({ subcategoria_id: z.string() }))
      .query(({ input }) => getPostersBySubcategory(input.subcategoria_id)),
    getLatest: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(({ input }) => getLatestPosters(input?.limit || 10)),
    create: publicProcedure
      .input(
        z.object({
          titulo: z.string().min(1),
          categoria: z.enum(VALID_CATEGORIES),
          subcategoria_id: z.string().min(1),
          precio: z.number().min(0),
          imagen_url: z.string().url(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { password, ...posterData } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          const newHash = await hashPassword(password);
          await setAdminPassword(newHash);
        } else {
          const isValid = await verifyPassword(password, storedHash);
          if (!isValid) {
            throw new Error("Contraseña incorrecta");
          }
        }

        return createPoster(posterData);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          titulo: z.string().min(1).optional(),
          categoria: z.enum(VALID_CATEGORIES).optional(),
          subcategoria_id: z.string().optional(),
          precio: z.number().min(0).optional(),
          imagen_url: z.string().url().optional(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password, ...updateData } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          throw new Error("No hay contraseña de administrador configurada");
        }

        const isValid = await verifyPassword(password, storedHash);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return updatePoster(id, updateData);
      }),
    delete: publicProcedure
      .input(
        z.object({
          id: z.string(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password } = input;

        const storedHash = await getAdminPassword();
        if (!storedHash) {
          throw new Error("No hay contraseña de administrador configurada");
        }

        const isValid = await verifyPassword(password, storedHash);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        const success = await deletePoster(id);
        return { success };
      }),
  }),


  search: router({
    posters: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(({ input }) => searchPosters(input.query)),
    suggestions: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(({ input }) => getSearchSuggestions(input.query)),
  }),


  admin: router({
    setPassword: publicProcedure
      .input(z.object({ password: z.string().min(6) }))
      .mutation(async ({ input }) => {
        const hash = await hashPassword(input.password);
        const success = await setAdminPassword(hash);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
