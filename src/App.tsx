/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DoodleGame } from './components/DoodleGame';
import { Sun, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-100 to-blue-200 text-slate-800 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full max-w-[375px] flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-400/40">
            <Sun className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-sky-900 flex items-center gap-1.5 font-sans">
              千岛
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold shadow-sm">
                375×812
              </span>
            </h1>
            <p className="text-[11px] text-sky-700/90 font-bold">
              夏日跳跳乐 &bull; 避开红色陷阱方块
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-white/80 px-2.5 py-1 rounded-full border border-sky-200 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>夏日主题</span>
        </div>
      </header>

      {/* Main Game Component (375x812 Mobile Viewport) */}
      <main className="w-full flex justify-center">
        <DoodleGame />
      </main>

      {/* Footer Legend */}
      <footer className="w-full max-w-[375px] mt-2 px-2 text-center text-[11px] text-sky-800/80">
        <span>电脑端控制: </span>
        <span className="text-sky-950 font-bold">A / D 或 &larr; &rarr;</span> 移动 &bull;{' '}
        <span className="text-sky-950 font-bold">空格 / 鼠标点击</span> 发射水气球
      </footer>
    </div>
  );
}

