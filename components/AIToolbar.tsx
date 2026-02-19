"use client";

import { useState } from "react";

interface AIToolbarProps {
  noteContent: string;
  onSummary: (summary: string) => void;
  onActionItems: (items: string) => void;
  onImprove: (improved: string) => void;
  disabled?: boolean;
}

export default function AIToolbar({
  noteContent,
  onSummary,
  onActionItems,
  onImprove,
  disabled,
}: AIToolbarProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAIAction = async (action: "summarize" | "actions" | "improve") => {
    if (!noteContent.trim()) return;

    setLoading(action);
    try {
      const response = await fetch(`/api/ai/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });

      const data = await response.json();

      if (data.success) {
        switch (action) {
          case "summarize":
            onSummary(data.data);
            break;
          case "actions":
            onActionItems(data.data);
            break;
          case "improve":
            onImprove(data.data);
            break;
        }
      } else {
        console.error("AI Error:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Failed to process AI request");
    } finally {
      setLoading(null);
    }
  };

  const isDisabled = disabled || !noteContent.trim();

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <span className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
        AI Actions:
      </span>
      <button
        onClick={() => handleAIAction("summarize")}
        disabled={isDisabled || loading !== null}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800"
      >
        {loading === "summarize" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          "✨"
        )}
        Summarize
      </button>
      <button
        onClick={() => handleAIAction("actions")}
        disabled={isDisabled || loading !== null}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
      >
        {loading === "actions" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          "📋"
        )}
        Get Action Items
      </button>
      <button
        onClick={() => handleAIAction("improve")}
        disabled={isDisabled || loading !== null}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
      >
        {loading === "improve" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          "✍️"
        )}
        Improve Writing
      </button>
    </div>
  );
}
