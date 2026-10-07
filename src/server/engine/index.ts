import type {
  NexusNode,
  NexusEdge,
  NodeType,
  NodeExecutionStep,
  WorkflowExecutionOutput,
  WebhookNodeConfig,
  AINodeConfig,
  HTTPNodeConfig,
  DatabaseNodeConfig,
} from "@/types/workflow";
import { executeAI } from "@/server/ai";
import { executeHTTP } from "@/server/http";
import { executeDatabase } from "@/server/database";

function formatTimestamp(): string {
  const d = new Date();
  return d.toTimeString().split(" ")[0];
}

/**
 * Topological sort of workflow nodes using React Flow edges.
 * Handles disconnected components and falls back gracefully on cycles.
 */
export function orderNodesByGraph(nodes: NexusNode[], edges: NexusEdge[]): NexusNode[] {
  if (nodes.length <= 1) return [...nodes];

  const nodeMap = new Map<string, NexusNode>();
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const node of nodes) {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  }

  // Calculate in-degree from edges
  for (const edge of edges) {
    if (nodeMap.has(edge.source) && nodeMap.has(edge.target)) {
      adj.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  }

  // Queue nodes with in-degree 0 (triggers/entry points)
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) {
      queue.push(id);
    }
  }

  const sorted: NexusNode[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodeMap.get(currentId);
    if (node) sorted.push(node);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      const newDeg = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg <= 0 && !visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  // If there are unvisited nodes (e.g., disconnected or cycle), append them
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      sorted.push(node);
    }
  }

  return sorted;
}

export async function executeWebhookNode(
  config: WebhookNodeConfig = {},
  incomingPayload: unknown = {},
): Promise<{ output: unknown; logs: string[] }> {
  const logs: string[] = [];
  const t = formatTimestamp();
  logs.push(`${t} Webhook trigger received event`);

  const payload =
    incomingPayload && Object.keys(incomingPayload).length > 0
      ? incomingPayload
      : {
          event: "nexus.webhook.triggered",
          timestamp: new Date().toISOString(),
          headers: { "content-type": "application/json" },
          body: {
            source: config.webhookName || "default_webhook",
            path: config.path || "/api/v1/trigger",
            status: "active",
          },
        };

  logs.push(`${t} Webhook payload parsed successfully`);
  return { output: payload, logs };
}

export async function executeAINode(
  config: AINodeConfig = {},
  inputData: unknown = {},
): Promise<{ output: unknown; logs: string[] }> {
  const logs: string[] = [];
  const t = formatTimestamp();
  const provider = config.provider || "gemini";
  const model = config.model || "gemini-1.5-flash";

  logs.push(`${t} AI node started [Provider: ${provider}, Model: ${model}]`);
  const result = await executeAI(config, inputData);

  logs.push(`${t} AI execution finished in ${result.latencyMs}ms (${result.tokensUsed.total} tokens)`);
  if (result.simulated) {
    logs.push(`${t} [Notice] Executed via local intelligence fallback engine`);
  }

  return { output: result, logs };
}

export async function executeHTTPNode(
  config: HTTPNodeConfig = {},
  inputData: unknown = {},
): Promise<{ output: unknown; logs: string[] }> {
  const logs: string[] = [];
  const t = formatTimestamp();
  const method = config.method || "GET";
  const url = config.url || "https://httpbin.org/anything";

  logs.push(`${t} HTTP request initiated [${method} ${url}]`);
  const result = await executeHTTP(config, inputData);

  logs.push(`${t} HTTP response received: ${result.status} ${result.statusText} (${result.latencyMs}ms)`);
  return { output: result, logs };
}

export async function executeDatabaseNode(
  config: DatabaseNodeConfig = {},
  inputData: unknown = {},
): Promise<{ output: unknown; logs: string[] }> {
  const logs: string[] = [];
  const t = formatTimestamp();
  const op = config.operation || "SELECT";
  const table = config.table || "workflow_records";

  logs.push(`${t} Database query started [${op} on table "${table}"]`);
  const result = await executeDatabase(config, inputData);

  logs.push(`${t} Database operation succeeded: ${result.rowsAffected} row(s) affected (${result.latencyMs}ms)`);
  return { output: result, logs };
}

export async function executeNode(
  node: NexusNode,
  inputData: unknown = {},
): Promise<{ output: unknown; logs: string[] }> {
  const rawType = node.type || (node.data as any)?.type || "default";
  const label = (node.data as any)?.label || rawType;
  const config = (node.data as any)?.config || {};

  switch (rawType) {
    case "webhook":
      return await executeWebhookNode(config, inputData);

    case "ai":
      return await executeAINode(config, inputData);

    case "http":
      return await executeHTTPNode(config, inputData);

    case "database":
      return await executeDatabaseNode(config, inputData);

    default: {
      const logs = [
        `${formatTimestamp()} Custom node "${label}" started`,
        `${formatTimestamp()} Custom node "${label}" completed successfully`,
      ];
      return {
        output: {
          step: label,
          nodeId: node.id,
          input: inputData,
          processedAt: new Date().toISOString(),
        },
        logs,
      };
    }
  }
}

/**
 * Main graph execution engine.
 * Orders nodes via React Flow graph edges, passes upstream output downstream,
 * records step logs, durations, and handles node-level failure cascades.
 */
export async function executeWorkflow(
  nodes: NexusNode[],
  edges: NexusEdge[],
  initialInput: Record<string, unknown> = {},
): Promise<{
  success: boolean;
  status: "completed" | "failed";
  output: WorkflowExecutionOutput;
  error?: string;
}> {
  const startTime = Date.now();
  const orderedNodes = orderNodesByGraph(nodes, edges);
  const steps: NodeExecutionStep[] = [];

  let currentContext: unknown = initialInput;
  let workflowFailed = false;
  let failureError = "";

  for (let i = 0; i < orderedNodes.length; i++) {
    const node = orderedNodes[i];
    const nodeType = (node.type || (node.data as any)?.type || "default") as NodeType;
    const nodeLabel = (node.data as any)?.label || `${nodeType} step`;

    // If an earlier node failed, mark subsequent nodes as skipped
    if (workflowFailed) {
      steps.push({
        nodeId: node.id,
        nodeType,
        nodeLabel,
        status: "skipped",
        logs: [`${formatTimestamp()} Step skipped due to upstream failure`],
      });
      continue;
    }

    const nodeStart = Date.now();
    const stepLogs: string[] = [`${formatTimestamp()} ${nodeLabel} started`];

    try {
      const { output, logs } = await executeNode(node, currentContext);
      const nodeDuration = Date.now() - nodeStart;
      stepLogs.push(...logs);
      stepLogs.push(`${formatTimestamp()} ${nodeLabel} completed in ${nodeDuration}ms`);

      steps.push({
        nodeId: node.id,
        nodeType,
        nodeLabel,
        status: "completed",
        startedAt: new Date(nodeStart).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: nodeDuration,
        input: currentContext,
        output,
        logs: stepLogs,
      });

      // Pass this node's output forward to downstream nodes
      currentContext = output;
    } catch (err: any) {
      const nodeDuration = Date.now() - nodeStart;
      const errorMsg = err instanceof Error ? err.message : String(err);
      stepLogs.push(`${formatTimestamp()} [ERROR] ${nodeLabel} failed: ${errorMsg}`);

      steps.push({
        nodeId: node.id,
        nodeType,
        nodeLabel,
        status: "failed",
        startedAt: new Date(nodeStart).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: nodeDuration,
        input: currentContext,
        error: errorMsg,
        logs: stepLogs,
      });

      workflowFailed = true;
      failureError = `${nodeLabel} failed: ${errorMsg}`;
    }
  }

  const totalDurationMs = Date.now() - startTime;
  const executionStatus = workflowFailed ? "failed" : "completed";

  const output: WorkflowExecutionOutput = {
    summary: workflowFailed
      ? `Workflow failed at step: ${failureError}`
      : `Workflow executed successfully (${orderedNodes.length} nodes, ${edges.length} connections)`,
    nodes: steps,
    connectionsCount: edges.length,
    totalDurationMs,
    executedAt: new Date().toISOString(),
  };

  return {
    success: !workflowFailed,
    status: executionStatus,
    output,
    error: workflowFailed ? failureError : undefined,
  };
}
