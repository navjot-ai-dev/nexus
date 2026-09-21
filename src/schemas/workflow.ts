import { z } from "zod";

/*
 * React Flow node validation
 */
const workflowNodeSchema = z.object({
  id: z.string().min(1),

  type: z.string().optional(),

  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  data: z.record(z.string(), z.unknown()).default({}),
});

/*
 * React Flow edge validation
 */
const workflowEdgeSchema = z.object({
  id: z.string().min(1),

  source: z.string().min(1),

  target: z.string().min(1),

  sourceHandle: z.string().nullable().optional(),

  targetHandle: z.string().nullable().optional(),

  type: z.string().optional(),

  animated: z.boolean().optional(),
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

  nodes: z
    .array(workflowNodeSchema)
    .default([]),

  edges: z
    .array(workflowEdgeSchema)
    .default([]),

  active: z
    .boolean()
    .default(false),
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
 * Types
 */
export type CreateWorkflowInput = z.infer<
  typeof createWorkflowSchema
>;

export type UpdateWorkflowInput = z.infer<
  typeof updateWorkflowSchema
>;