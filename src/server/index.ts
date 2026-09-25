import { Hono } from "hono";
import workflows from "./routes/workflows";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running 🚀",
  });
});

app.route("/workflows", workflows);

export default app;