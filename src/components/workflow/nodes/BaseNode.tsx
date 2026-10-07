"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeType } from "@/types/workflow";

interface BaseNodeProps {
  id: string;
  selected?: boolean;
  type: NodeType;
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  children?: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
  status?: "idle" | "running" | "completed" | "failed";
}

export const BaseNode = memo(function BaseNode({
  selected,
  type,
  title,
  subtitle,
  badge,
  icon,
  iconBg,
  iconColor,
  accentBorder,
  children,
  hasInput = true,
  hasOutput = true,
  status = "idle",
}: BaseNodeProps) {
  return (
    <div
      className={`group relative min-w-[260px] max-w-[320px] rounded-2xl border bg-white p-4 transition-all duration-200 select-none ${
        selected
          ? `border-[#ff6749] shadow-[0_0_0_2px_rgba(255,103,73,0.25),0_12px_32px_rgba(23,32,42,0.12)]`
          : `border-[#e9e2d9] shadow-[0_8px_24px_rgba(23,32,42,0.06)] hover:border-[#ded5c8] hover:shadow-[0_12px_32px_rgba(23,32,42,0.09)]`
      }`}
    >
      {/* Top Accent bar */}
      <div
        className={`absolute top-0 left-6 right-6 h-[3px] rounded-t-full ${accentBorder}`}
      />

      {/* Input Handle (Left) */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3.5 !w-3.5 !-left-[7px] !rounded-full !border-2 !border-white !bg-[#ff6749] shadow-sm transition-transform hover:!scale-125"
        />
      )}

      {/* Node Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${iconBg} ${iconColor}`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-[#17202a]">
                {title}
              </span>
            </div>
            {subtitle && (
              <p className="truncate text-xs text-[#8a94a6]">{subtitle}</p>
            )}
          </div>
        </div>

        {badge && (
          <span className="shrink-0 rounded-md bg-[#f4efe8] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[#667085] uppercase">
            {badge}
          </span>
        )}
      </div>

      {/* Node Body Details */}
      {children && <div className="mt-3 pt-3 border-t border-[#f4efe8] text-xs text-[#475467]">{children}</div>}

      {/* Status indicator */}
      {status !== "idle" && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium">
          {status === "running" && (
            <>
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
              <span className="text-amber-600">Executing...</span>
            </>
          )}
          {status === "completed" && (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 font-semibold">Completed</span>
            </>
          )}
          {status === "failed" && (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-rose-600 font-semibold">Failed</span>
            </>
          )}
        </div>
      )}

      {/* Output Handle (Right) */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3.5 !w-3.5 !-right-[7px] !rounded-full !border-2 !border-white !bg-[#ff6749] shadow-sm transition-transform hover:!scale-125"
        />
      )}
    </div>
  );
});
