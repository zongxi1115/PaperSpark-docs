'use client';

import { useEffect, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ChangelogEntry {
  version: string;
  date: string;
  url: string;
  features: string[];
  fixes: string[];
}

function parseChangelog(raw: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
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

export function ChangelogTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 font-medium text-sm border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 text-center">
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            查看更新记录
          </span>
        </button>
      </Dialog.Trigger>

      <ChangelogModal />
    </Dialog.Root>
  );
}

function ChangelogModal() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChangelog = useCallback(() => {
    fetch(CHANGELOG_URL)
      .then((r) => r.text())
      .then((text) => {
        setEntries(parseChangelog(text).slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchChangelog();
  }, [fetchChangelog]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-[#141220] border border-slate-200/60 dark:border-white/[0.08] shadow-2xl dark:shadow-black/40 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/40 dark:border-white/[0.06]">
          <div>
            <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
              更新记录
            </Dialog.Title>
            <Dialog.Description className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              持续迭代，不断进化
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Dialog.Close>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-72px)]">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
              加载中...
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
              暂无更新记录
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-300 dark:from-indigo-500/40 via-slate-200 dark:via-white/10 to-transparent" />

              <div className="space-y-6">
                {entries.map((entry, idx) => (
                  <div key={entry.version} className="relative flex gap-4">
                    <div className="relative z-10 mt-1.5 flex-shrink-0">
                      <div
                        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                          idx === 0
                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/20'
                            : 'border-slate-300 bg-white dark:border-white/20 dark:bg-white/5'
                        }`}
                      >
                        {idx === 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          v{entry.version}
                        </h3>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {entry.date}
                        </span>
                        {entry.url && (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          >
                            GitHub
                          </a>
                        )}
                      </div>

                      {entry.features.length > 0 && (
                        <div className="mb-1.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              新功能
                            </span>
                          </div>
                          <ul className="space-y-0.5 ml-3">
                            {entry.features.map((f, i) => (
                              <li
                                key={i}
                                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                              >
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.fixes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              修复
                            </span>
                          </div>
                          <ul className="space-y-0.5 ml-3">
                            {entry.fixes.map((f, i) => (
                              <li
                                key={i}
                                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                              >
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
