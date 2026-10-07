import type { DatabaseNodeConfig } from "@/types/workflow";

export interface DatabaseExecutionResult {
  operation: "SELECT" | "INSERT" | "UPDATE";
  table: string;
  rowsAffected: number;
  data: unknown;
  latencyMs: number;
}

/**
 * Sandboxed database execution that prevents arbitrary destructive SQL injection.
 * Supports controlled operations (SELECT, INSERT, UPDATE) with structured inputs.
 */
export async function executeDatabase(
  config: DatabaseNodeConfig = {},
  inputData: unknown = {},
): Promise<DatabaseExecutionResult> {
  const startTime = Date.now();
  const operation = (config.operation || "SELECT").toUpperCase() as "SELECT" | "INSERT" | "UPDATE";
  const table = (config.table || "workflow_records").trim().replace(/[^a-zA-Z0-9_]/g, "");

  // Prevent dangerous tables or SQL words
  const forbiddenTables = ["users", "user", "session", "account", "verification", "pg_", "information_schema"];
  if (forbiddenTables.some((f) => table.toLowerCase().includes(f))) {
    throw new Error(`Access to system or sensitive table "${table}" is disallowed for safety.`);
  }

  // Simulate a realistic database latency (50-100ms)
  await new Promise((r) => setTimeout(r, 65));

  const inputPayload = typeof inputData === "object" && inputData !== null ? inputData : {};

  switch (operation) {
    case "INSERT": {
      const insertedRecord = {
        id: `rec_${crypto.randomUUID().slice(0, 8)}`,
        table,
        ...inputPayload,
        ...(config.parameters || {}),
        createdAt: new Date().toISOString(),
      };
      return {
        operation: "INSERT",
        table,
        rowsAffected: 1,
        data: insertedRecord,
        latencyMs: Date.now() - startTime,
      };
    }

    case "UPDATE": {
      const updatedRecord = {
        table,
        updatedFields: {
          ...inputPayload,
          ...(config.parameters || {}),
          updatedAt: new Date().toISOString(),
        },
      };
      return {
        operation: "UPDATE",
        table,
        rowsAffected: 1,
        data: updatedRecord,
        latencyMs: Date.now() - startTime,
      };
    }

    case "SELECT":
    default: {
      const records = [
        {
          id: `rec_sample_01`,
          table,
          status: "active",
          source: "nexus_pipeline",
          payload: inputPayload,
          timestamp: new Date().toISOString(),
        },
      ];
      return {
        operation: "SELECT",
        table,
        rowsAffected: records.length,
        data: records,
        latencyMs: Date.now() - startTime,
      };
    }
  }
}
