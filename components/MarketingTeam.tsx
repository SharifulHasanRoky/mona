"use client";

import { useState } from "react";

type MarketingRole =
  | "strategist"
  | "copywriter"
  | "seo_expert"
  | "social_media"
  | "email_marketer"
  | "brand_analyst";

type MarketingResult = {
  role: MarketingRole;
  roleName: string;
  content: string;
};

const ROLES: { role: MarketingRole; name: string; icon: string; color: string }[] = [
  { role: "strategist", name: "Strategist", icon: "🎯", color: "border-purple-500/60 bg-purple-500/10" },
  { role: "copywriter", name: "Copywriter", icon: "✍️", color: "border-blue-500/60 bg-blue-500/10" },
  { role: "seo_expert", name: "SEO Expert", icon: "🔍", color: "border-green-500/60 bg-green-500/10" },
  { role: "social_media", name: "Social Media", icon: "📱", color: "border-pink-500/60 bg-pink-500/10" },
  { role: "email_marketer", name: "Email Marketing", icon: "📧", color: "border-amber-500/60 bg-amber-500/10" },
  { role: "brand_analyst", name: "Brand Analyst", icon: "📊", color: "border-cyan-500/60 bg-cyan-500/10" },
];

export default function MarketingTeam() {
  const [prompt, setPrompt] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<MarketingRole[]>([]);
  const [results, setResults] = useState<MarketingResult[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  function toggleRole(role: MarketingRole) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function selectAll() {
    setSelectedRoles(ROLES.map((r) => r.role));
  }

  function selectNone() {
    setSelectedRoles([]);
  }

  function toggleExpand(role: string) {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  }

  function expandAll() {
    setExpandedRoles(new Set(results.map((r) => r.role)));
  }

  function collapseAll() {
    setExpandedRoles(new Set());
  }

  async function handleSubmit() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSummary(null);
    setExpandedRoles(new Set());

    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          role: selectedRoles.length === 1 ? selectedRoles[0] : "team",
          roles: selectedRoles.length > 0 ? selectedRoles : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      setResults(data.results || []);
      setSummary(data.summary || null);
      // Auto-expand all results
      setExpandedRoles(new Set((data.results || []).map((r: MarketingResult) => r.role)));
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-line/60 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-lg">
          🚀
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">AI Marketing Team</h1>
          <p className="text-xs text-zinc-500">Powered by Claude &middot; 6 Specialist Agents</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Input */}
        <div className="flex w-[420px] shrink-0 flex-col border-r border-line/60 bg-bg-panel/50">
          <div className="flex-1 overflow-y-auto p-5">
            {/* Brief / Prompt */}
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Marketing Brief
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="Describe your product, campaign, or marketing challenge...&#10;&#10;Example: Launch campaign for a new AI-powered fitness app targeting millennials. Budget: $50K/month. Goal: 10K signups in 30 days."
              className="w-full resize-none rounded-xl border border-line/60 bg-bg-input px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Ctrl+Enter to run &middot; Max 5000 characters
            </p>

            {/* Role Selection */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Team Members</label>
                <div className="flex gap-2 text-[11px]">
                  <button onClick={selectAll} className="text-accent hover:underline">
                    All
                  </button>
                  <span className="text-zinc-600">|</span>
                  <button onClick={selectNone} className="text-zinc-400 hover:underline">
                    None
                  </button>
                </div>
              </div>
              <p className="mb-3 text-[11px] text-zinc-500">
                Select specific specialists or leave empty to run the full team.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ role, name, icon, color }) => {
                  const selected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                        selected
                          ? `${color} border-opacity-100`
                          : "border-line/60 bg-bg/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      <span className={selected ? "text-zinc-100" : ""}>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 11-6.2-8.55" />
                  </svg>
                  Team is working...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Run {selectedRoles.length === 0
                    ? "Full Team"
                    : selectedRoles.length === 1
                    ? ROLES.find((r) => r.role === selectedRoles[0])?.name
                    : `${selectedRoles.length} Specialists`}
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Results */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {results.length === 0 && !loading ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div className="mb-4 text-4xl">🎨</div>
              <h2 className="mb-2 text-lg font-medium text-zinc-300">
                Your marketing team awaits
              </h2>
              <p className="max-w-md text-sm text-zinc-500">
                Describe your product, brand, or campaign. Your AI marketing team will collaborate
                to deliver strategy, copy, SEO plans, social content, email sequences, and brand
                analysis — all at once.
              </p>
              <div className="mt-6 grid max-w-lg grid-cols-1 gap-2 text-left">
                {[
                  "Launch a DTC skincare brand targeting Gen Z on TikTok and Instagram",
                  "Create a B2B SaaS go-to-market strategy for an AI code review tool",
                  "Plan a product hunt launch campaign for a productivity Chrome extension",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="rounded-lg border border-line/60 bg-bg-panel/40 px-4 py-3 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors text-left"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mb-4 flex gap-2">
                {ROLES.filter(
                  (r) => selectedRoles.length === 0 || selectedRoles.includes(r.role)
                ).map(({ icon }, i) => (
                  <span
                    key={i}
                    className="animate-bounce text-2xl"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {icon}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-400">
                Your marketing team is brainstorming...
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                This may take 15–30 seconds for the full team
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5">
              {/* Summary */}
              {summary && (
                <div className="mb-4 rounded-xl border border-accent/40 bg-accent/5 px-5 py-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    <span>📋</span> Team Summary
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
                </div>
              )}

              {/* Controls */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {results.length} specialist{results.length !== 1 ? "s" : ""} responded
                </span>
                <div className="flex gap-2 text-[11px]">
                  <button onClick={expandAll} className="text-zinc-400 hover:text-zinc-200">
                    Expand all
                  </button>
                  <span className="text-zinc-600">|</span>
                  <button onClick={collapseAll} className="text-zinc-400 hover:text-zinc-200">
                    Collapse all
                  </button>
                </div>
              </div>

              {/* Individual Results */}
              <div className="space-y-3">
                {results.map((result) => {
                  const roleConfig = ROLES.find((r) => r.role === result.role);
                  const isExpanded = expandedRoles.has(result.role);

                  return (
                    <div
                      key={result.role}
                      className={`rounded-xl border transition-all ${
                        roleConfig?.color || "border-line/60 bg-bg-panel/40"
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(result.role)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <span className="text-lg">{roleConfig?.icon || "💡"}</span>
                        <span className="flex-1 text-sm font-medium text-zinc-200">
                          {result.roleName}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-zinc-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-line/40 px-4 pb-4 pt-3">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                            {result.content}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => copyToClipboard(result.content)}
                              className="flex items-center gap-1.5 rounded-md border border-line/60 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
