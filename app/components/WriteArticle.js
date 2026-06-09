'use client';

import { useCompletion } from 'ai/react';

export default function WriteArticle() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/completion',
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <h1 className="text-2xl font-bold tracking-tight border-b border-zinc-800 pb-4">
          Write Article Engine
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            value={input}
            placeholder="Enter your research topic or prompt..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-medium text-sm py-3 rounded hover:bg-zinc-200 disabled:opacity-50 transition-opacity"
          >
            Generate Structure
          </button>
        </form>

        {completion && (
          <div className="bg-zinc-950 border border-zinc-900 rounded p-6 overflow-y-auto max-h-[500px]">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {completion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
