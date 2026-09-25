import { Hono } from "hono";
import { eq, desc, and } from "drizzle-orm";

import { db } from "@/db";
import { workflows } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  createWorkflowSchema,
  updateWorkflowSchema,
} from "@/schemas/workflow";

const workflowsRoute = new Hono();

/* =========================
   GET ALL WORKFLOWS
========================= */

workflowsRoute.get("/", async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const result = await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, session.user.id))
      .orderBy(desc(workflows.updatedAt));

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET /workflows error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch workflows",
      },
      500,
    );
  }
});

/* =========================
   GET ONE WORKFLOW
========================= */

workflowsRoute.get("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");

    const result = await db
      .select()
      .from(workflows)
      .where(
        and(
          eq(workflows.id, id),
          eq(workflows.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!result.length) {
      return c.json(
        {
          success: false,
          message: "Workflow not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("GET /workflows/:id error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch workflow",
      },
      500,
    );
  }
});

/* =========================
   CREATE WORKFLOW
========================= */

workflowsRoute.post("/", async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const body = await c.req.json();

    const parsed = createWorkflowSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid workflow data",
          errors: parsed.error.flatten(),
        },
        400,
      );
    }

    const workflow = await db
      .insert(workflows)
      .values({
        id: crypto.randomUUID(),
        name: parsed.data.name,
        description: parsed.data.description,
        userId: session.user.id,
        nodes: parsed.data.nodes,
        edges: parsed.data.edges,
        active: parsed.data.active,
      })
      .returning();

    return c.json(
      {
        success: true,
        message: "Workflow created successfully",
        data: workflow[0],
      },
      201,
    );
  } catch (error) {
    console.error("POST /workflows error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create workflow",
      },
      500,
    );
  }
});

/* =========================
   UPDATE WORKFLOW
========================= */

workflowsRoute.patch("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");
    const body = await c.req.json();

    const parsed = updateWorkflowSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Invalid workflow data",
          errors: parsed.error.flatten(),
        },
        400,
      );
    }

    const result = await db
      .update(workflows)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workflows.id, id),
          eq(workflows.userId, session.user.id),
        ),
      )
      .returning();

    if (!result.length) {
      return c.json(
        {
          success: false,
          message: "Workflow not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Workflow updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("PATCH /workflows/:id error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update workflow",
      },
      500,
    );
  }
});

/* =========================
   DELETE WORKFLOW
========================= */

workflowsRoute.delete("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const id = c.req.param("id");

    const result = await db
      .delete(workflows)
      .where(
        and(
          eq(workflows.id, id),
          eq(workflows.userId, session.user.id),
        ),
      )
      .returning();

    if (!result.length) {
      return c.json(
        {
          success: false,
          message: "Workflow not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /workflows/:id error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to delete workflow",
      },
      500,
    );
  }
});

export default workflowsRoute;