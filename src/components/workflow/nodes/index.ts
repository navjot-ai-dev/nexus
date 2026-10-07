import type { NodeTypes } from "@xyflow/react";
import { WebhookNode } from "./WebhookNode";
import { AINode } from "./AINode";
import { HTTPNode } from "./HTTPNode";
import { DatabaseNode } from "./DatabaseNode";
import { DefaultFallbackNode } from "./DefaultFallbackNode";

export const workflowNodeTypes: NodeTypes = {
  webhook: WebhookNode,
  ai: AINode,
  http: HTTPNode,
  database: DatabaseNode,
  default: DefaultFallbackNode,
};

export {
  WebhookNode,
  AINode,
  HTTPNode,
  DatabaseNode,
  DefaultFallbackNode,
};
