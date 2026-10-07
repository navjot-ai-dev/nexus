import type { HTTPNodeConfig } from "@/types/workflow";

export interface HTTPExecutionResult {
  status: number;
  statusText: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  data: unknown;
  latencyMs: number;
}

/**
 * SSRF protection: ensures the target URL does not point to internal network
 * ranges, metadata services, localhost, or invalid protocols.
 */
export function validateSafeURL(urlStr: string): { valid: boolean; reason?: string; url?: URL } {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, reason: "Only http and https protocols are supported." };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check localhost & loopback
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local")
    ) {
      return { valid: false, reason: "Access to loopback/local addresses is forbidden for security." };
    }

    // Check Cloud metadata services
    if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") {
      return { valid: false, reason: "Access to cloud metadata endpoints is strictly blocked." };
    }

    // Check private RFC 1918 IPv4 ranges
    const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ipv4Match) {
      const b1 = parseInt(ipv4Match[1], 10);
      const b2 = parseInt(ipv4Match[2], 10);

      // 10.0.0.0/8
      if (b1 === 10) return { valid: false, reason: "Private IP ranges (10.0.0.0/8) are blocked." };
      // 172.16.0.0/12
      if (b1 === 172 && b2 >= 16 && b2 <= 31) return { valid: false, reason: "Private IP ranges (172.16.0.0/12) are blocked." };
      // 192.168.0.0/16
      if (b1 === 192 && b2 === 168) return { valid: false, reason: "Private IP ranges (192.168.0.0/16) are blocked." };
      // 127.0.0.0/8
      if (b1 === 127) return { valid: false, reason: "Loopback IP addresses are blocked." };
    }

    return { valid: true, url: parsed };
  } catch {
    return { valid: false, reason: "Invalid URL string provided." };
  }
}

/**
 * Executes a real outbound HTTP request with timeouts and SSRF guards.
 */
export async function executeHTTP(
  config: HTTPNodeConfig = {},
  inputData: unknown = {},
  timeoutMs: number = 8000,
): Promise<HTTPExecutionResult> {
  const startTime = Date.now();
  let targetUrl = config.url?.trim() || "";

  // If no URL is provided, provide a safe echo test endpoint or handle gracefully
  if (!targetUrl) {
    targetUrl = "https://httpbin.org/anything";
  }

  // Substitute template variables if present: e.g. {{id}}
  if (typeof inputData === "object" && inputData !== null) {
    for (const [key, val] of Object.entries(inputData)) {
      const placeholder = `{{${key}}}`;
      if (targetUrl.includes(placeholder)) {
        targetUrl = targetUrl.replaceAll(placeholder, encodeURIComponent(String(val)));
      }
    }
  }

  const validation = validateSafeURL(targetUrl);
  if (!validation.valid || !validation.url) {
    throw new Error(`SSRF / URL Security Error: ${validation.reason || "Invalid URL"}`);
  }

  // Append query params
  const finalUrl = new URL(validation.url.toString());
  if (config.queryParams && typeof config.queryParams === "object") {
    for (const [k, v] of Object.entries(config.queryParams)) {
      if (k && v !== undefined) {
        finalUrl.searchParams.append(k, String(v));
      }
    }
  }

  const method = (config.method || "GET").toUpperCase();
  const headers: Record<string, string> = {
    "User-Agent": "NEXUS-Workflow-Engine/1.0",
    Accept: "application/json, text/plain, */*",
    ...(config.headers || {}),
  };

  let bodyContent: string | undefined = undefined;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (config.body) {
      bodyContent = config.body;
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    } else if (inputData && Object.keys(inputData).length > 0) {
      bodyContent = JSON.stringify(inputData);
      headers["Content-Type"] = "application/json";
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(finalUrl.toString(), {
      method,
      headers,
      body: bodyContent,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const latencyMs = Date.now() - startTime;
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    let data: unknown;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json().catch(() => ({}));
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status} ${response.statusText}: ${typeof data === "string" ? data.slice(0, 150) : JSON.stringify(data).slice(0, 150)}`);
    }

    return {
      status: response.status,
      statusText: response.statusText,
      url: finalUrl.toString(),
      method,
      headers: responseHeaders,
      data,
      latencyMs,
    };
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`HTTP request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}
