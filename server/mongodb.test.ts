import { describe, expect, it } from "vitest";
import mongoose from "mongoose";

describe("MongoDB Connection", () => {
  it("should have MONGODB_URI configured", () => {
    const mongoUri = process.env.MONGODB_URI;
    expect(mongoUri).toBeDefined();
    expect(mongoUri).not.toBe("");
    expect(mongoUri).toContain("mongodb");
  });

  it("should connect to MongoDB Atlas", async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI no está configurado");
    }

    try {
      await mongoose.connect(mongoUri);
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
      await mongoose.disconnect();
    } catch (error) {
      throw new Error(`Error conectando a MongoDB: ${error}`);
    }
  }, 30000); // Timeout de 30 segundos
});
