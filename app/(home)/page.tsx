'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    // Trigger draw animation after mount
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      path.style.strokeDashoffset = '0';
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#faf9f7] dark:bg-[#0c0a14] transition-colors duration-700 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Ambient glow */}
      <div className="absolute top-[-15%] left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-300/15 dark:bg-indigo-500/8 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[0%] w-[400px] h-[400px] rounded-full bg-amber-200/10 dark:bg-amber-500/4 blur-[120px] pointer-events-none"></div>

      {/* Compact hero */}
      <div className="relative z-10 pt-20 md:pt-24 pb-8 px-6 max-w-6xl mx-auto">
        {/* Announcement pill */}
        <div className="flex justify-center mb-10">
          <a href="#" className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/15 transition-all duration-300 hover:border-amber-300/70">
            <span className="text-sm">🥳</span>
            <span className=" text-amber-700 dark:text-amber-300">
              v0.7.0 首个开源论文写作一站式工具！
            </span>
          </a>
        </div>

        {/* Hero heading */}
        <div className="text-center mb-8">
          <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            AI 驱动的
          </h1>
          <div className="relative inline-block">
            <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold tracking-tight leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                学术阅读与写作
              </span>
            </h1>
            {/* Hand-drawn underline animation */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-6 overflow-visible"
              viewBox="0 0 300 20"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                ref={pathRef}
                d="M2 14 C40 6, 80 18, 120 10 C160 2, 200 16, 240 8 C260 4, 280 12, 298 7"
                stroke="url(#underline-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white mt-1">
            工作台
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10 text-center">
          从文献导入、沉浸式阅读，到知识图谱和论文编辑。
          科研的关键流程，融合进同一个空间。
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a href="https://paper.062679.xyz" target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-slate-900/15 dark:shadow-white/10 text-center">
            <span className="flex items-center justify-center gap-2">
              在线体验
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </span>
          </a>
          <Link href="/docs" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 font-medium text-sm border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 text-center">
            阅读文档本地部署！
          </Link>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap justify-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-0">
          {[
            { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: '文献导入', color: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200/40 dark:border-teal-500/15' },
            { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: '沉浸式阅读', color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-500/15' },
            { icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', label: '知识图谱', color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/40 dark:border-violet-500/15' },
            { icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: '论文编辑', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/40 dark:border-rose-500/15' },
          ].map((f) => (
            <div key={f.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${f.color} transition-transform hover:-translate-y-0.5 cursor-default`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={f.icon}/></svg>
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* App preview - immediately visible */}
      <div className="relative w-full max-w-5xl mx-auto px-6">
        <div className="relative rounded-t-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-2xl shadow-slate-900/5 dark:shadow-black/30 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200/40 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-0.5 rounded-md bg-slate-200/40 dark:bg-white/[0.04] text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wide">
                paperspark.app/workspace
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="flex h-64 md:h-80">
            {/* Sidebar */}
            <div className="w-44 md:w-52 border-r border-slate-200/30 dark:border-white/[0.04] p-4 space-y-2 bg-slate-50/20 dark:bg-white/[0.01]">
              <div className="h-3.5 w-16 bg-slate-200/60 dark:bg-white/[0.05] rounded"></div>
              <div className="h-7 w-full bg-indigo-100/50 dark:bg-indigo-500/10 rounded-lg border border-indigo-200/30 dark:border-indigo-500/12"></div>
              <div className="h-7 w-full bg-slate-100/50 dark:bg-white/[0.03] rounded-lg"></div>
              <div className="h-7 w-full bg-slate-100/50 dark:bg-white/[0.03] rounded-lg"></div>
              <div className="mt-3 h-3 w-14 bg-slate-200/50 dark:bg-white/[0.04] rounded"></div>
              <div className="h-5 w-full bg-slate-100/30 dark:bg-white/[0.02] rounded"></div>
              <div className="h-5 w-3/4 bg-slate-100/30 dark:bg-white/[0.02] rounded"></div>
              <div className="h-5 w-5/6 bg-slate-100/30 dark:bg-white/[0.02] rounded"></div>
            </div>

            {/* Main editor */}
            <div className="flex-1 p-5 md:p-7 space-y-2.5 overflow-hidden">
              <div className="h-5 w-1/2 bg-slate-200/60 dark:bg-white/[0.06] rounded-md"></div>
              <div className="h-2 w-full bg-slate-100/40 dark:bg-white/[0.025] rounded-full"></div>
              <div className="h-2 w-full bg-slate-100/40 dark:bg-white/[0.025] rounded-full"></div>
              <div className="h-2 w-11/12 bg-slate-100/40 dark:bg-white/[0.025] rounded-full"></div>
              <div className="h-2 w-full bg-slate-100/40 dark:bg-white/[0.025] rounded-full"></div>
              <div className="h-2 w-4/5 bg-slate-100/40 dark:bg-white/[0.025] rounded-full"></div>
              {/* AI suggestion card */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-500/[0.05] border border-amber-200/30 dark:border-amber-500/08">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs">✨</span>
                  <div className="h-3 w-20 bg-amber-200/40 dark:bg-amber-500/12 rounded"></div>
                </div>
                <div className="h-2 w-full bg-amber-100/30 dark:bg-amber-500/06 rounded-full"></div>
                <div className="h-2 w-3/5 bg-amber-100/30 dark:bg-amber-500/06 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Knowledge graph panel */}
            <div className="hidden md:block w-44 p-4 relative bg-slate-50/10 dark:bg-white/[0.01] border-l border-slate-200/30 dark:border-white/[0.04]">
              <div className="absolute top-8 left-6 w-6 h-6 rounded-full bg-teal-100/80 dark:bg-teal-500/12 border border-teal-300/40 dark:border-teal-500/20"></div>
              <div className="absolute top-16 right-6 w-8 h-8 rounded-full bg-indigo-100/80 dark:bg-indigo-500/12 border border-indigo-300/40 dark:border-indigo-500/20"></div>
              <div className="absolute bottom-12 left-10 w-5 h-5 rounded-full bg-violet-100/80 dark:bg-violet-500/12 border border-violet-300/40 dark:border-violet-500/20"></div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
                <line x1="28%" y1="20%" x2="62%" y2="35%" className="stroke-slate-200/60 dark:stroke-white/[0.05]" strokeWidth="1"/>
                <line x1="62%" y1="35%" x2="36%" y2="65%" className="stroke-slate-200/60 dark:stroke-white/[0.05]" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
