"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/navigation";

// Prevent static generation for Firebase auth pages
export const dynamic = "force-dynamic";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              AI Smart Notes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take notes smarter with the power of AI. Summarize, extract action
              items, and improve your writing instantly.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Summarization
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get instant summaries of your long notes with Gemini AI
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Action Items
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Automatically extract tasks and to-dos from your notes
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Improve Writing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enhance grammar, clarity, and professionalism
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Powered by
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Firebase
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Gemini AI
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Next.js
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="flex justify-center">
            <AuthButton user={user} />
          </div>

          {/* Footer */}
          <div className="mt-16 text-sm text-gray-400 dark:text-gray-500">
            Built for Firebase + Gemini Demo Session
          </div>
        </div>
      </div>
    </main>
  );
}
