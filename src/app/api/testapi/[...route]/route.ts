import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running 🚀",
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);