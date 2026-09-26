import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running ??",
  });
});

export const GET = handle(app);
