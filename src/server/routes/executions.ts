import { Hono } from "hono";
import { and, desc, eq, count } from "drizzle-orm";

import { db } from "@/db";
import { workflows, workflowExecutions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { normalizeWorkflowNodes } from "@/schemas/workflow";
import { executeWorkflow } from "@/server/engine";
import type { NexusEdge } from "@/types/workflow";

const executionsRoute = new Hono();

/**
 * GET /stats
 * Returns overall workflow & execution statistics for the dashboard.
 */
executionsRoute.get("/stats", async (c) => {
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

    const userWorkflows = await db
      .select({
        id: workflows.id,
        active: workflows.active,
      })
      .from(workflows)
      .where(eq(workflows.userId, session.user.id));

    const totalWorkflows = userWorkflows.length;
    const activeWorkflows = userWorkflows.filter((w) => w.active).length;

    const userExecutions = await db
      .select({
        id: workflowExecutions.id,
        status: workflowExecutions.status,
      })
      .from(workflowExecutions)
      .where(eq(workflowExecutions.userId, session.user.id));

    const totalExecutions = userExecutions.length;
    const successfulExecutions = userExecutions.filter(
      (e) => e.status === "completed",
    ).length;
    const failedExecutions = userExecutions.filter(
      (e) => e.status === "failed",
    ).length;

    return c.json({
      success: true,
      data: {
        totalWorkflows,
        activeWorkflows,
        totalExecutions,
        successfulExecutions,
        failedExecutions,
      },
    });
  } catch (error) {
    console.error("GET /stats error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch stats",
      },
      500,
    );
  }
});

/**
 * GET /:id/executions
 * Returns execution history for a specific workflow.
 */
executionsRoute.get("/:id/executions", async (c) => {
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

    const workflowId = c.req.param("id");

    // Make sure workflow belongs to this user
    const workflow = await db
      .select({ id: workflows.id, name: workflows.name })
      .from(workflows)
      .where(
        and(
          eq(workflows.id, workflowId),
          eq(workflows.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!workflow.length) {
      return c.json(
        {
          success: false,
          message: "Workflow not found",
        },
        404,
      );
    }

    const executions = await db
      .select()
      .from(workflowExecutions)
      .where(
        and(
          eq(workflowExecutions.workflowId, workflowId),
          eq(workflowExecutions.userId, session.user.id),
        ),
      )
      .orderBy(desc(workflowExecutions.createdAt))
      .limit(50);

    return c.json({
      success: true,
      data: executions,
    });
  } catch (error) {
    console.error("GET /:id/executions error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch execution history",
      },
      500,
    );
  }
});

/**
 * GET /:id/executions/:executionId
 * Returns full details of a specific execution, including node logs.
 */
executionsRoute.get("/:id/executions/:executionId", async (c) => {
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

    const workflowId = c.req.param("id");
    const executionId = c.req.param("executionId");

    const result = await db
      .select()
      .from(workflowExecutions)
      .where(
        and(
          eq(workflowExecutions.id, executionId),
          eq(workflowExecutions.workflowId, workflowId),
          eq(workflowExecutions.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!result.length) {
      return c.json(
        {
          success: false,
          message: "Execution record not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("GET /:id/executions/:executionId error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch execution details",
      },
      500,
    );
  }
});

/**
 * POST /:id/execute
 * Executes a workflow using the graph execution engine.
 */
executionsRoute.post("/:id/execute", async (c) => {
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

    const workflowId = c.req.param("id");

    const result = await db
      .select()
      .from(workflows)
      .where(
        and(
          eq(workflows.id, workflowId),
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

    const workflow = result[0];

    // Read optional input payload from request body
    let executionInput: Record<string, unknown> = {};
    try {
      const body = await c.req.json();
      if (body && typeof body === "object") {
        executionInput = (body.input as Record<string, unknown>) || body;
      }
    } catch {
      // empty body is acceptable
    }

    if (!workflow.active) {
      return c.json(
        {
          success: false,
          message: "Workflow is inactive. Please activate it before executing.",
        },
        400,
      );
    }

    const rawNodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
    const edges = (Array.isArray(workflow.edges) ? workflow.edges : []) as NexusEdge[];
    const normalizedNodes = normalizeWorkflowNodes(rawNodes);

    if (normalizedNodes.length === 0) {
      return c.json(
        {
          success: false,
          message: "Cannot execute an empty workflow. Add at least one node.",
        },
        400,
      );
    }

    const executionId = crypto.randomUUID();
    const startTime = new Date();

    // Insert pending/running execution record
    await db.insert(workflowExecutions).values({
      id: executionId,
      workflowId: workflow.id,
      userId: session.user.id,
      status: "running",
      input: executionInput,
      output: {},
      startedAt: startTime,
    });

    try {
      // Execute graph via topological sorting engine
      const executionOutcome = await executeWorkflow(
        normalizedNodes,
        edges,
        executionInput,
      );

      const completedTime = new Date();

      const updated = await db
        .update(workflowExecutions)
        .set({
          status: executionOutcome.status,
          output: executionOutcome.output as any,
          error: executionOutcome.error || null,
          completedAt: completedTime,
        })
        .where(eq(workflowExecutions.id, executionId))
        .returning();

      return c.json({
        success: executionOutcome.success,
        message: executionOutcome.success
          ? "Workflow executed successfully 🚀"
          : "Workflow execution failed at one or more steps",
        data: updated[0],
      });
    } catch (runErr: any) {
      const errorMsg = runErr instanceof Error ? runErr.message : String(runErr);

      await db
        .update(workflowExecutions)
        .set({
          status: "failed",
          error: errorMsg,
          completedAt: new Date(),
        })
        .where(eq(workflowExecutions.id, executionId));

      return c.json(
        {
          success: false,
          message: `Execution failed: ${errorMsg}`,
        },
        500,
      );
    }
  } catch (error) {
    console.error("POST /workflows/:id/execute error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to execute workflow",
      },
      500,
    );
  }
});

export default executionsRoute;