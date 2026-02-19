"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types";
import AIToolbar from "./AIToolbar";

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
  onUpdate?: (noteId: string, updates: Partial<Note>) => Promise<void>;
}

export default function NoteEditor({
  note,
  onSave,
  onCancel,
  onUpdate,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState<{
    type: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
    setAiResult(null);
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSave(title, content);
      if (!note) {
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleSummary = async (summary: string) => {
    setAiResult({ type: "Summary", content: summary });
    if (note && onUpdate) {
      await onUpdate(note.id, { summary });
    }
  };

  const handleActionItems = async (items: string) => {
    setAiResult({ type: "Action Items", content: items });
    if (note && onUpdate) {
      const itemsArray = items
        .split("\n")
        .filter((item) => item.trim())
        .map((item) => item.replace(/^\d+\.\s*/, "").trim());
      await onUpdate(note.id, { actionItems: itemsArray });
    }
  };

  const handleImprove = (improved: string) => {
    setAiResult({ type: "Improved Writing", content: improved });
  };

  const applyImprovedWriting = () => {
    if (aiResult?.type === "Improved Writing") {
      setContent(aiResult.content);
      setAiResult(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {note ? "Edit Note" : "New Note"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <input
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      <textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      <AIToolbar
        noteContent={content}
        onSummary={handleSummary}
        onActionItems={handleActionItems}
        onImprove={handleImprove}
        disabled={!content.trim()}
      />

      {aiResult && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              AI {aiResult.type}
            </h3>
            {aiResult.type === "Improved Writing" && (
              <button
                onClick={applyImprovedWriting}
                className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Apply Changes
              </button>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
            {aiResult.content}
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim() || !content.trim()}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Note"}
        </button>
      </div>
    </div>
  );
}
