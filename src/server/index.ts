import { Hono } from "hono";
import workflowsRoute from "./routes/workflows";

const app = new Hono().basePath("/api/nexus");

app.get("/ping", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running 🚀",
  });
});

app.route("/workflows", workflowsRoute);

export default app;