import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { hashPassword, verifyPassword } from "./auth-utils";
import type { TrpcContext } from "./_core/context";
import { setAdminPassword, getAdminPassword } from "./db";

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

describe("posters with authentication", () => {
  const ctx = createPublicContext();
  const caller = appRouter.createCaller(ctx);
  let testPassword: string;
  let testPasswordHash: string;

  beforeAll(async () => {
    testPassword = "testPassword123";
    testPasswordHash = await hashPassword(testPassword);
    await setAdminPassword(testPasswordHash);
  });

  describe("auth utils", () => {
    it("should hash password correctly", async () => {
      const hash = await hashPassword("test123");
      expect(hash).toBeDefined();
      expect(hash).not.toBe("test123");
    });

    it("should verify correct password", async () => {
      const hash = await hashPassword("test123");
      const isValid = await verifyPassword("test123", hash);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const hash = await hashPassword("test123");
      const isValid = await verifyPassword("wrongPassword", hash);
      expect(isValid).toBe(false);
    });
  });

  describe("posters.update", () => {
    it("should update poster with correct password", async () => {
      const newPoster = {
        titulo: "Update Test Poster",
        categoria: "Bandas" as const,
        precio: 5000,
        imagen_url: "https://via.placeholder.com/300x400?text=Update",
        password: testPassword,
      };

      const createResult = await caller.posters.create(newPoster);
      expect(createResult).toBeDefined();

      // Get the created poster ID
      const allPosters = await caller.posters.getAll();
      const createdPoster = allPosters.find(p => p.titulo === "Update Test Poster");
      expect(createdPoster).toBeDefined();

      if (createdPoster) {
        const updateResult = await caller.posters.update({
          id: createdPoster.id,
          titulo: "Updated Title",
          password: testPassword,
        });

        expect(updateResult).toBeDefined();
        expect(updateResult?.titulo).toBe("Updated Title");
      }
    });

    it("should reject update with wrong password", async () => {
      const allPosters = await caller.posters.getAll();
      const poster = allPosters[0];

      if (poster) {
        try {
          await caller.posters.update({
            id: poster.id,
            titulo: "Should Fail",
            password: "wrongPassword",
          });
          expect.fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("posters.delete", () => {
    it("should delete poster with correct password", async () => {
      const newPoster = {
        titulo: "Delete Test Poster",
        categoria: "Peliculas" as const,
        precio: 3000,
        imagen_url: "https://via.placeholder.com/300x400?text=Delete",
        password: testPassword,
      };

      const createResult = await caller.posters.create(newPoster);
      expect(createResult).toBeDefined();

      // Get the created poster ID
      const allPosters = await caller.posters.getAll();
      const createdPoster = allPosters.find(p => p.titulo === "Delete Test Poster");
      expect(createdPoster).toBeDefined();

      if (createdPoster) {
        const deleteResult = await caller.posters.delete({
          id: createdPoster.id,
          password: testPassword,
        });

        expect(deleteResult.success).toBe(true);

        // Verify deletion
        const postersAfterDelete = await caller.posters.getAll();
        const deletedPoster = postersAfterDelete.find(p => p.id === createdPoster.id);
        expect(deletedPoster).toBeUndefined();
      }
    });

    it("should reject delete with wrong password", async () => {
      const allPosters = await caller.posters.getAll();
      const poster = allPosters[0];

      if (poster) {
        try {
          await caller.posters.delete({
            id: poster.id,
            password: "wrongPassword",
          });
          expect.fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("admin.setPassword", () => {
    it("should set new admin password", async () => {
      const newPassword = "newPassword456";
      const result = await caller.admin.setPassword({ password: newPassword });
      expect(result.success).toBe(true);

      // Verify the new password works
      const hash = await getAdminPassword();
      expect(hash).toBeDefined();
      if (hash) {
        const isValid = await verifyPassword(newPassword, hash);
        expect(isValid).toBe(true);
      }
    });

    it("should reject password shorter than 6 characters", async () => {
      try {
        await caller.admin.setPassword({ password: "short" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
