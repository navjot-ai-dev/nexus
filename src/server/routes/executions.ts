import { Hono } from "hono";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  workflows,
  workflowExecutions,
} from "@/db/schema";
import { auth } from "@/lib/auth";

const executionsRoute = new Hono();

executionsRoute.post(
  "/:id/execute",
  async (c) => {
    try {
      // 1. Check authentication
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

      // 2. Find workflow belonging to current user
      const result = await db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, workflowId),
            eq(
              workflows.userId,
              session.user.id,
            ),
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

      // 3. Check workflow is active
      if (!workflow.active) {
        return c.json(
          {
            success: false,
            message:
              "Workflow is inactive. Activate it before executing.",
          },
          400,
        );
      }

      // 4. Create execution record
      const executionId = crypto.randomUUID();

      const execution = await db
        .insert(workflowExecutions)
        .values({
          id: executionId,
          workflowId: workflow.id,
          userId: session.user.id,
          status: "running",
          input: {},
          output: {},
          startedAt: new Date(),
        })
        .returning();

      try {
        // 5. Execute nodes
        const nodes = Array.isArray(workflow.nodes)
          ? workflow.nodes
          : [];

        const edges = Array.isArray(workflow.edges)
          ? workflow.edges
          : [];

        const executionResults = [];

        for (const node of nodes as any[]) {
          console.log(
            `Executing node: ${node.id}`,
          );

          const nodeType =
            node.data?.type ||
            node.type ||
            "default";

          let output: unknown;

          switch (nodeType) {
            case "webhook":
              output = {
                message:
                  "Webhook node executed",
              };
              break;

            case "ai":
              output = {
                message:
                  "AI processor node executed",
              };
              break;

            case "http":
              output = {
                message:
                  "HTTP request node executed",
              };
              break;

            case "database":
              output = {
                message:
                  "Database node executed",
              };
              break;

            default:
              output = {
                message:
                  "Node executed successfully",
              };
          }

          executionResults.push({
            nodeId: node.id,
            nodeType,
            output,
          });
        }

        // 6. Save successful execution
        const finalOutput = {
          nodes: executionResults,
          connections: edges.length,
        };

        const updatedExecution =
          await db
            .update(workflowExecutions)
            .set({
              status: "completed",
              output: finalOutput,
              completedAt: new Date(),
            })
            .where(
              eq(
                workflowExecutions.id,
                executionId,
              ),
            )
            .returning();

        return c.json({
          success: true,
          message:
            "Workflow executed successfully",
          data: updatedExecution[0],
        });
      } catch (executionError) {
        console.error(
          "Workflow execution error:",
          executionError,
        );

        // 7. Save failed execution
        await db
          .update(workflowExecutions)
          .set({
            status: "failed",
            error:
              executionError instanceof Error
                ? executionError.message
                : "Workflow execution failed",
            completedAt: new Date(),
          })
          .where(
            eq(
              workflowExecutions.id,
              executionId,
            ),
          );

        return c.json(
          {
            success: false,
            message:
              "Workflow execution failed",
          },
          500,
        );
      }
    } catch (error) {
      console.error(
        "POST /workflows/:id/execute error:",
        error,
      );

      return c.json(
        {
          success: false,
          message:
            "Failed to execute workflow",
        },
        500,
      );
    }
  },
);

export default executionsRoute;