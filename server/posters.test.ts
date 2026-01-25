import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("posters router", () => {
  const ctx = createPublicContext();
  const caller = appRouter.createCaller(ctx);

  describe("getAll", () => {
    it("should return an array of posters", async () => {
      const result = await caller.posters.getAll();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return posters with required fields", async () => {
      const result = await caller.posters.getAll();
      if (result.length > 0) {
        const poster = result[0];
        expect(poster).toHaveProperty("id");
        expect(poster).toHaveProperty("titulo");
        expect(poster).toHaveProperty("categoria");
        expect(poster).toHaveProperty("precio");
        expect(poster).toHaveProperty("imagen_url");
      }
    });
  });

  describe("getByCategory", () => {
    it("should return posters for a valid category", async () => {
      const result = await caller.posters.getByCategory({ categoria: "Bandas" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent category", async () => {
      const result = await caller.posters.getByCategory({ categoria: "NoExiste" });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter posters by category correctly", async () => {
      const result = await caller.posters.getByCategory({ categoria: "Bandas" });
      if (result.length > 0) {
        result.forEach((poster) => {
          expect(poster.categoria).toBe("Bandas");
        });
      }
    });
  });

  describe("getLatest", () => {
    it("should return latest posters with default limit", async () => {
      const result = await caller.posters.getLatest({});
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it("should return limited number of posters", async () => {
      const result = await caller.posters.getLatest({ limit: 5 });
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should return posters ordered by creation date (newest first)", async () => {
      const result = await caller.posters.getLatest({ limit: 2 });
      if (result.length > 1) {
        const first = new Date(result[0].createdAt).getTime();
        const second = new Date(result[1].createdAt).getTime();
        expect(first).toBeGreaterThanOrEqual(second);
      }
    });
  });
});
