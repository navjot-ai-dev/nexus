import { Node, Edge } from "@xyflow/react";

export type NodeType = "webhook" | "ai" | "http" | "database" | "default";

export interface WebhookNodeConfig {
  webhookName?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path?: string;
  description?: string;
}

export interface AINodeConfig {
  provider?: "gemini" | "openai" | "anthropic";
  model?: string;
  prompt?: string;
  systemInstructions?: string;
  temperature?: number;
}

export interface HTTPNodeConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: string;
}

export interface DatabaseNodeConfig {
  operation?: "SELECT" | "INSERT" | "UPDATE";
  table?: string;
  parameters?: Record<string, unknown>;
  query?: string;
}

export interface CustomNodeData extends Record<string, unknown> {
  label?: string;
  description?: string;
  type?: NodeType;
  config?: WebhookNodeConfig | AINodeConfig | HTTPNodeConfig | DatabaseNodeConfig;
  status?: "idle" | "running" | "completed" | "failed";
}

export type NexusNode = Node<CustomNodeData, NodeType>;
export type NexusEdge = Edge;

export interface NodeExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  input?: unknown;
  output?: unknown;
  error?: string;
  logs: string[];
}

export interface WorkflowExecutionOutput {
  summary: string;
  nodes: NodeExecutionStep[];
  connectionsCount: number;
  totalDurationMs: number;
  executedAt: string;
}

export interface WorkflowRecord {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  nodes: NexusNode[];
  edges: NexusEdge[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastExecution?: {
    id: string;
    status: "pending" | "running" | "completed" | "failed";
    createdAt: string;
    durationMs?: number;
  } | null;
}
