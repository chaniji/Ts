import { it, expect, describe } from "bun:test";
import request from "supertest";
import app from "../app.js";

describe("App", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });

  it("GET /health should return 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });

  it("GET /test should return 200", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
