import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running 🚀",
  });
});

export async function GET(request: Request) {
  const response = await app.fetch(request);

  return response;
}