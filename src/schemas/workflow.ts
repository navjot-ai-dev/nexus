import { z } from "zod";
import type { NexusNode, NodeType } from "@/types/workflow";

/*
 * React Flow node validation
 */
export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.string(), z.unknown()).default({}),
  style: z.record(z.string(), z.unknown()).optional(),
  selected: z.boolean().optional(),
});

/*
 * React Flow edge validation
 */
export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  style: z.record(z.string(), z.unknown()).optional(),
});

/*
 * Create workflow
 */
export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .max(100, "Workflow name is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .default(""),
  nodes: z.array(workflowNodeSchema).default([]),
  edges: z.array(workflowEdgeSchema).default([]),
  active: z.boolean().default(false),
});

/*
 * Update workflow
 */
export const updateWorkflowSchema = createWorkflowSchema.partial();

/*
 * Workflow ID
 */
export const workflowIdSchema = z.object({
  id: z.string().min(1, "Workflow ID is required"),
});

/*
 * Execute workflow input
 */
export const executeWorkflowSchema = z.object({
  input: z.record(z.string(), z.unknown()).optional().default({}),
});

/*
 * Types
 */
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;

/**
 * Normalizes old workflows where nodes might have had `type: "default"`
 * or legacy structures, converting them into properly typed Nexus nodes.
 */
export function normalizeWorkflowNodes(rawNodes: unknown[]): NexusNode[] {
  if (!Array.isArray(rawNodes)) return [];

  return rawNodes.map((rawNode: any) => {
    let rawType = rawNode.type;
    const label = rawNode.data?.label || "";
    const id = rawNode.id || "";

    // Infer type if it's default or undefined
    if (!rawType || rawType === "default") {
      if (rawNode.data?.type) {
        rawType = rawNode.data.type;
      } else if (id.startsWith("webhook-") || /webhook/i.test(label)) {
        rawType = "webhook";
      } else if (id.startsWith("ai-") || /ai/i.test(label)) {
        rawType = "ai";
      } else if (id.startsWith("http-") || /http|api/i.test(label)) {
        rawType = "http";
      } else if (id.startsWith("database-") || /database|db/i.test(label)) {
        rawType = "database";
      } else {
        rawType = "default";
      }
    }

    const validTypes: NodeType[] = ["webhook", "ai", "http", "database", "default"];
    const type: NodeType = validTypes.includes(rawType) ? (rawType as NodeType) : "default";

    return {
      id: rawNode.id || crypto.randomUUID(),
      type,
      position: {
        x: typeof rawNode.position?.x === "number" ? rawNode.position.x : 100,
        y: typeof rawNode.position?.y === "number" ? rawNode.position.y : 100,
      },
      data: {
        label: rawNode.data?.label || getNodeDefaultTitle(type),
        description: rawNode.data?.description || getNodeDefaultDescription(type),
        type,
        config: rawNode.data?.config || {},
        status: rawNode.data?.status || "idle",
        ...rawNode.data,
      },
      style: rawNode.style,
      selected: Boolean(rawNode.selected),
    };
  });
}

export function getNodeDefaultTitle(type: NodeType): string {
  switch (type) {
    case "webhook":
      return "Webhook Trigger";
    case "ai":
      return "AI Processor";
    case "http":
      return "HTTP Request";
    case "database":
      return "Database Query";
    default:
      return "Custom Step";
  }
}

export function getNodeDefaultDescription(type: NodeType): string {
  switch (type) {
    case "webhook":
      return "Trigger workflow from HTTP request";
    case "ai":
      return "Process text with AI models";
    case "http":
      return "Make outbound REST API calls";
    case "database":
      return "Run safe database query";
    default:
      return "Workflow step";
  }
}