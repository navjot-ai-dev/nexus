import { Hono } from "hono";

import workflowsRoute from "./routes/workflows";
import executionsRoute from "./routes/executions";

const app = new Hono().basePath("/api/nexus");

app.get("/ping", (c) => {
  return c.json({
    success: true,
    message: "NEXUS API is running 🚀",
  });
});

// Mount executionsRoute first so /workflows/stats does not get captured by /workflows/:id
app.route("/workflows", executionsRoute);
app.route("/workflows", workflowsRoute);

// Also expose /stats at root of /api/nexus/stats for clean dashboard consumption
app.route("/stats", executionsRoute);

export default app;