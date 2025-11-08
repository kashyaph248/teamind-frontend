"use client";

import React, { useState } from "react";

// ✅ Set this to your actual Render backend URL
const API_BASE = "https://teamind-backend.onrender.com";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [fileSummary, setFileSummary] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textSummary, setTextSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload() {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }
    setError(null);
    setFileSummary(null);
    setLoadingFile(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error((data as any).detail || "File upload failed");
      }

      setFileSummary((data as any).summary || "No summary returned.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong while summarizing file.");
    } finally {
      setLoadingFile(false);
    }
  }

  async function handleTextSummarize() {
    if (!textInput.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }
    setError(null);
    setTextSummary(null);
    setLoadingText(true);

    try {
      const res = await fetch(`${API_BASE}/api/summarize-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error((data as any).detail || "Text summarize failed");
      }

      setTextSummary((data as any).summary || "No summary returned.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong while summarizing text.");
    } finally {
      setLoadingText(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl space-y-10">
        <h1 className="text-3xl font-bold text-center">
          TeamMind AI — MVP
        </h1>

        {/* FILE UPLOAD SECTION */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-semibold">1️⃣ Summarize a File</h2>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setFileSummary(null);
              setError(null);
            }}
            className="mb-2 text-sm"
          />
          <button
            onClick={handleFileUpload}
            disabled={loadingFile}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl disabled:bg-slate-700"
          >
            {loadingFile ? "Analyzing file..." : "Summarize File"}
          </button>

          {fileSummary && (
            <pre className="bg-slate-950 mt-3 p-3 rounded-xl whitespace-pre-wrap text-sm">
              {fileSummary}
            </pre>
          )}
        </section>

        {/* TEXT INPUT SECTION */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-semibold">2️⃣ Summarize Raw Text</h2>
          <p className="text-slate-400 text-sm">
            Paste any chat, email thread, meeting notes, or article content.
          </p>
          <textarea
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setError(null);
            }}
            rows={6}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500"
            placeholder="Paste text here..."
          />
          <button
            onClick={handleTextSummarize}
            disabled={loadingText}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl disabled:bg-slate-700"
          >
            {loadingText ? "Analyzing text..." : "Summarize Text"}
          </button>

          {textSummary && (
            <pre className="bg-slate-950 mt-3 p-3 rounded-xl whitespace-pre-wrap text-sm">
              {textSummary}
            </pre>
          )}
        </section>

        {error && (
          <div className="bg-red-900/40 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}

