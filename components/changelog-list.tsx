'use client';

import { useEffect, useState } from 'react';

interface ChangelogEntry {
  version: string;
  date: string;
  url: string;
  features: string[];
  fixes: string[];
}

function parseChangelog(raw: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  // Match both # and ## version headers: "# 1.0.0 (2026-04-07)" or "## [1.1.2](...) (2026-05-02)"
  const versionBlocks = raw.split(/^#{1,2}\s+/m).slice(1);

  for (const block of versionBlocks) {
    const headerMatch = block.match(
      /^\[?([^\]\s]+)\]?\s*(?:\([^)]*\))?\s*(?:\(?\s*(\d{4}-\d{2}-\d{2})\s*\))?/
    );
    if (!headerMatch) continue;

    const version = headerMatch[1];
    const date = headerMatch[2] || '';
    const urlMatch = block.match(/\((https:\/\/github\.com[^)]+)\)/);
    const url = urlMatch ? urlMatch[1] : '';

    const features: string[] = [];
    const fixes: string[] = [];

    const sections = block.split(/^###\s+/m).slice(1);
    for (const section of sections) {
      const lines = section.trim().split('\n');
      const title = lines[0].trim().toLowerCase();
      const items = lines
        .slice(1)
        .map((l) =>
          l
            .replace(/^\*\s+/, '')
            // Strip commit links like ([abc1234](https://...))
            .replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, '')
            .trim()
        )
        .filter(Boolean);

      if (title.includes('feature')) {
        features.push(...items);
      } else if (title.includes('fix') || title.includes('bug')) {
        fixes.push(...items);
      }
    }

    if (features.length || fixes.length) {
      entries.push({ version, date, url, features, fixes });
    }
  }

  return entries;
}

const CHANGELOG_URL =
  'https://raw.githubusercontent.com/zongxi1115/PaperSpark/refs/heads/master/CHANGELOG.md';

function FireworksCanvas() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:absolute;top:-8px;left:-8px;width:calc(100% + 16px);height:calc(100% + 16px);pointer-events:none;z-index:20;border-radius:inherit;';
    const parent = document.getElementById('latest-entry');
    if (!parent) return;
    parent.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    let w: number, h: number;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];

    const addBurst = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4;
        const speed = 1.5 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.8 + Math.random() * 0.6,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          decay: 0.012 + Math.random() * 0.01,
        });
      }
    };

    // Fire a few bursts at staggered times
    const bursts = [
      { t: 0, x: 0.7, y: 0.3 },
      { t: 200, x: 0.3, y: 0.5 },
      { t: 500, x: 0.85, y: 0.6 },
    ];
    const timers = bursts.map((b) =>
      setTimeout(() => addBurst(b.x * w, b.y * h), b.t)
    );

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (particles.length > 0) {
        frame = requestAnimationFrame(draw);
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      canvas.remove();
    };
  }, []);

  return null;
}

export default function ChangelogList() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CHANGELOG_URL)
      .then((r) => r.text())
      .then((text) => {
        setEntries(parseChangelog(text));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        加载中...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        暂无更新记录
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-300 dark:from-indigo-500/40 via-slate-200 dark:via-white/10 to-transparent" />

      <div className="space-y-8">
        {entries.map((entry, idx) => {
          const isLatest = idx === 0;
          return (
            <div
              key={entry.version}
              id={isLatest ? 'latest-entry' : undefined}
              className="relative flex gap-5"
            >
              {isLatest && <FireworksCanvas />}

              {/* Timeline dot */}
              <div className="relative z-10 mt-1.5 flex-shrink-0">
                <div
                  className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isLatest
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'border-slate-300 bg-white dark:border-white/20 dark:bg-white/5'
                  }`}
                >
                  {isLatest && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                {/* Header */}
                <div className="flex items-baseline gap-3 mb-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    v{entry.version}
                    {isLatest && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 animate-bounce">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" opacity="0.3" />
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        最新
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {entry.date}
                  </span>
                  {entry.url && (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>

                {/* Features */}
                {entry.features.length > 0 && (
                  <div className={`mb-3 rounded-xl p-3 ${isLatest ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-500/[0.06] dark:to-teal-500/[0.03] border border-emerald-200/40 dark:border-emerald-500/10' : 'bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-200/20 dark:border-emerald-500/05'}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10">
                        <svg className="w-3 h-3 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        新功能
                      </span>
                      <span className="ml-auto text-[10px] text-emerald-500/60 dark:text-emerald-400/40 font-medium">
                        {entry.features.length} 项
                      </span>
                    </div>
                    <ul className="space-y-1.5 ml-0.5">
                      {entry.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400 dark:text-emerald-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" opacity="0.2" fill="currentColor" />
                            <path d="M8 12l2.5 2.5L16 9" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes */}
                {entry.fixes.length > 0 && (
                  <div className="rounded-xl p-3 bg-amber-50/40 dark:bg-amber-500/[0.04] border border-amber-200/20 dark:border-amber-500/05">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-500/10 dark:bg-amber-400/10">
                        <svg className="w-3 h-3 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        修复
                      </span>
                      <span className="ml-auto text-[10px] text-amber-500/60 dark:text-amber-400/40 font-medium">
                        {entry.fixes.length} 项
                      </span>
                    </div>
                    <ul className="space-y-1.5 ml-0.5">
                      {entry.fixes.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400 dark:text-amber-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 9v4M12 17h.01" />
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" opacity="0.2" fill="currentColor" />
                            <path d="M12 9v4M12 17h.01" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
