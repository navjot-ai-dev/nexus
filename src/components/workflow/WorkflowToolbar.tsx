"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Save,
  CheckCircle2,
  AlertCircle,
  History,
  Power,
  RotateCw,
  Sparkles,
  Maximize2,
} from "lucide-react";

interface WorkflowToolbarProps {
  workflowName: string;
  workflowDescription: string | null;
  isActive: boolean;
  isSaving: boolean;
  isExecuting: boolean;
  hasUnsavedChanges?: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onToggleActive: () => void;
  onSave: () => void;
  onExecute: () => void;
  onToggleHistory: () => void;
  onFitView: () => void;
}

export function WorkflowToolbar({
  workflowName,
  workflowDescription,
  isActive,
  isSaving,
  isExecuting,
  hasUnsavedChanges = false,
  onNameChange,
  onDescriptionChange,
  onToggleActive,
  onSave,
  onExecute,
  onToggleHistory,
  onFitView,
}: WorkflowToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e9e2d9] bg-white px-4 md:px-6 z-20">
      {/* Left section: Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2d9] bg-[#fffdf9] text-[#667085] transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          {isEditingTitle ? (
            <input
              type="text"
              value={workflowName}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingTitle(false);
              }}
              onChange={(e) => onNameChange(e.target.value)}
              className="rounded-lg border border-[#ff6749] px-2 py-0.5 text-base font-bold text-[#17202a] outline-none"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer text-base font-bold tracking-tight text-[#17202a] hover:text-[#ff6749]"
                title="Click to rename"
              >
                {workflowName || "Untitled Workflow"}
              </h1>

              {hasUnsavedChanges && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Unsaved changes" />
              )}
            </div>
          )}

          <p className="text-[11px] text-[#8a94a6]">
            {workflowDescription || "Click title to edit name"}
          </p>
        </div>
      </div>

      {/* Right section: Controls & Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Fit View button */}
        <button
          onClick={onFitView}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2d9] bg-[#fffdf9] text-[#667085] transition hover:bg-[#f4efe8] hover:text-[#17202a]"
          title="Fit Canvas View"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* History button */}
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-1.5 rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs font-semibold text-[#475467] transition hover:border-[#ffb5a5] hover:bg-[#fff0eb] hover:text-[#ff6749]"
        >
          <History className="h-3.5 w-3.5" />
          <span className="hidden md:inline">History</span>
        </button>

        {/* Active Toggle */}
        <button
          onClick={onToggleActive}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-[#e9e2d9] bg-[#f4efe8] text-[#667085] hover:bg-[#eae3d8]"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <span>{isActive ? "Active" : "Inactive"}</span>
        </button>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-xl border border-[#e9e2d9] bg-white px-3.5 py-2 text-xs font-semibold text-[#17202a] shadow-xs transition hover:bg-[#fff0eb] hover:text-[#ff6749] disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>

        {/* Execute button */}
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-[0_4px_16px_rgba(255,103,73,0.25)] transition hover:-translate-y-0.5 disabled:opacity-60 ${
            isExecuting
              ? "bg-[#e55336]"
              : "bg-[#ff6749] hover:bg-[#f4573a]"
          }`}
        >
          {isExecuting ? (
            <>
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Execute</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
