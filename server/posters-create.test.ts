import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { hashPassword } from "./auth-utils";
import { setAdminPassword } from "./db";

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
  let testPassword: string;

  beforeAll(async () => {
    testPassword = "testPassword123";
    const hash = await hashPassword(testPassword);
    await setAdminPassword(hash);
  });

  it("should create a new poster with valid input", async () => {
    const newPoster = {
      titulo: "Poster Nirvana - Nevermind",
      categoria: "Bandas" as const,
      precio: 5000,
      imagen_url: "https://via.placeholder.com/300x400?text=Test+Poster",
      password: testPassword,
    };

    const result = await caller.posters.create(newPoster);
    expect(result).toBeDefined();
  });

  it("should reject poster creation with invalid categoria", async () => {
    const invalidPoster = {
      titulo: "Test Poster",
      categoria: "InvalidCategory" as any,
      precio: 5000,
      imagen_url: "https://via.placeholder.com/300x400?text=Test",
      password: testPassword,
    };

    try {
      await caller.posters.create(invalidPoster);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject poster creation with empty titulo", async () => {
    const invalidPoster = {
      titulo: "",
      categoria: "Bandas" as const,
      precio: 5000,
      imagen_url: "https://via.placeholder.com/300x400?text=Test",
      password: testPassword,
    };

    try {
      await caller.posters.create(invalidPoster);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject poster creation with invalid URL", async () => {
    const invalidPoster = {
      titulo: "Test Poster",
      categoria: "Bandas" as const,
      precio: 5000,
      imagen_url: "not-a-valid-url",
      password: testPassword,
    };

    try {
      await caller.posters.create(invalidPoster);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject poster creation with negative price", async () => {
    const invalidPoster = {
      titulo: "Test Poster",
      categoria: "Bandas" as const,
      precio: -5000,
      imagen_url: "https://via.placeholder.com/300x400?text=Test",
      password: testPassword,
    };

    try {
      await caller.posters.create(invalidPoster);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
