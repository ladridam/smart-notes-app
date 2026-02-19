"use client";

import { Note } from "@/types";

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelect: (note: Note) => void;
  onDelete: (noteId: string) => void;
  loading: boolean;
}

export default function NotesList({
  notes,
  selectedNote,
  onSelect,
  onDelete,
  loading,
}: NotesListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No notes yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first note to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note)}
          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            selectedNote?.id === note.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {note.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {note.content}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(note.updatedAt)}
                </span>
                {note.summary && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                    Has Summary
                  </span>
                )}
                {note.actionItems && note.actionItems.length > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full">
                    {note.actionItems.length} Actions
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this note?")) {
                  onDelete(note.id);
                }
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
