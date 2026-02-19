"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDbInstance } from "@/lib/firebase";
import { Note } from "@/types";

export function useNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const db = getDbInstance();
    const notesRef = collection(db, "notes");
    const q = query(
      notesRef,
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData: Note[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            userId: data.userId,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            summary: data.summary,
            actionItems: data.actionItems,
          };
        });
        setNotes(notesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notes:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addNote = async (title: string, content: string) => {
    if (!userId) throw new Error("User not authenticated");

    const db = getDbInstance();
    const notesRef = collection(db, "notes");
    const newNote = {
      title,
      content,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(notesRef, newNote);
    return docRef.id;
  };

  const updateNote = async (
    noteId: string,
    updates: Partial<Pick<Note, "title" | "content" | "summary" | "actionItems">>
  ) => {
    const db = getDbInstance();
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNote = async (noteId: string) => {
    const db = getDbInstance();
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
}
