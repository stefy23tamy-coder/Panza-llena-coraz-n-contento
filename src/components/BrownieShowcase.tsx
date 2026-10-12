import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Check, Eye } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  score: number;
  tierName?: string;
  compact?: boolean;
}

export const BrownieShowcase: React.FC<Props> = ({ score, tierName, compact = false }) => {
  const [activeHighlight, setActiveHighlight] = useState<'crust' | 'fudge' | 'nuts' | 'honey' | null>(null);

  const isDivine = score >= 55;
  const isMaster = score >= 45;
  const isDecent = score >= 30;

  // Visual styling adjustments based on score tier
  const crustShine = isDivine ? 'opacity-95' : isMaster ? 'opacity-85' : isDecent ? 'opacity-65' : 'opacity-40';
  const glowClass = isDivine
    ? 'shadow-[0_0_50px_rgba(245,158,11,0.55)] border-amber-300'
    : isMaster
    ? 'shadow-[0_0_35px_rgba(234,179,8,0.4)] border-amber-400'
    : 'shadow-xl border-amber-700/50';

  const handleInspect = (type: 'crust' | 'fudge' | 'nuts' | 'honey') => {
    sound.playClick();
    setActiveHighlight((prev) => (prev === type ? null : type));
  };

  return (
    <div className={`w-full flex flex-col items-center ${compact ? 'max-w-md' : 'max-w-2xl'}`}>
      {/* Container with rustic terracotta / slate aesthetic */}
      <div
        className={`relative w-full rounded-3xl bg-gradient-to-b from-[#1c120c] via-[#24150d] to-[#170e09] p-5 sm:p-7 border-4 ${glowClass} overflow-hidden flex flex-col items-center text-amber-50`}
      >
        {/* Divine Background Glow & Hearth Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
          {/* Subtle Hearth Embers Floating */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b18_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* Header Tag */}
        <div className="relative z-10 flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg">
              🍫
            </span>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block font-mythic">
                {tierName || (isDivine ? 'Obra Maestra Olímpica' : 'Brownies de Hestia')}
              </span>
              <h3 className="text-base sm:text-lg font-black font-mythic text-amber-100">
                Brownie Artesanal del Fuego Sagrado
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{score} / 60 Pts</span>
          </div>
        </div>

        {/* Brownie Visual Presentation Box */}
        <div className="relative z-10 w-full flex flex-col items-center my-2">
          {/* Steam animation floating up */}
          <div className="relative w-48 h-8 flex justify-center gap-6 pointer-events-none">
            <motion.div
              animate={{ y: [-2, -22, -32], opacity: [0, 0.7, 0], scale: [0.8, 1.2, 1.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
              className="text-stone-300/60 font-mythic text-xl filter blur-[1px]"
            >
              ☁
            </motion.div>
            <motion.div
              animate={{ y: [-2, -26, -38], opacity: [0, 0.8, 0], scale: [0.9, 1.3, 1.7] }}
              transition={{ duration: 3.2, delay: 0.9, repeat: Infinity, ease: 'easeOut' }}
              className="text-stone-300/70 font-mythic text-2xl filter blur-[1px]"
            >
              ☁
            </motion.div>
            <motion.div
              animate={{ y: [-2, -20, -30], opacity: [0, 0.6, 0], scale: [0.7, 1.1, 1.4] }}
              transition={{ duration: 2.5, delay: 1.6, repeat: Infinity, ease: 'easeOut' }}
              className="text-stone-300/60 font-mythic text-lg filter blur-[1px]"
            >
              ☁
            </motion.div>
          </div>

          {/* SVG / Graphic Artwork of the Platter and Brownie Slices */}
          <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
            <svg
              viewBox="0 0 460 340"
              className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Platter Shadow */}
                <radialGradient id="platterShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                {/* Terracotta/Slate Plate Gradient */}
                <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a2818" />
                  <stop offset="40%" stopColor="#2e170e" />
                  <stop offset="100%" stopColor="#1a0c07" />
                </linearGradient>

                {/* Plate Gold Rim */}
                <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Parchment Paper Gradient */}
                <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="60%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                </linearGradient>

                {/* Brownie Top Crust - Dark Rich Chocolate with Sheen */}
                <linearGradient id="brownieCrustGrad" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#3d1b0c" />
                  <stop offset="35%" stopColor="#4f2411" />
                  <stop offset="70%" stopColor="#2e1408" />
                  <stop offset="100%" stopColor="#1f0c05" />
                </linearGradient>

                {/* Ultra-Glossy Crust Sheen overlay */}
                <linearGradient id="crustSheen" x1="0%" y1="30%" x2="100%" y2="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="40%" stopColor="#ffffff" stopOpacity={isDivine ? "0.35" : "0.22"} />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity={isDivine ? "0.2" : "0.1"} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Brownie Fudgy Interior Cut Face - Gooey dark chocolate */}
                <linearGradient id="fudgyCutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#220e06" />
                  <stop offset="50%" stopColor="#301409" />
                  <stop offset="100%" stopColor="#150803" />
                </linearGradient>

                {/* Golden Honey Drizzle */}
                <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="90%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>

                {/* Toasted Walnut/Nut Gradient */}
                <linearGradient id="nutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              {/* 1. Ground Shadow */}
              <ellipse cx="230" cy="275" rx="195" ry="45" fill="url(#platterShadow)" />

              {/* 2. Terracotta Platter */}
              <ellipse cx="230" cy="255" rx="190" ry="55" fill="url(#plateGrad)" stroke="url(#goldRim)" strokeWidth="4" />
              <ellipse cx="230" cy="253" rx="178" ry="48" fill="#20100a" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              {/* 3. Parchment Paper (Crinkled edge) */}
              <polygon
                points="85,255 120,230 190,220 270,222 355,235 375,260 340,285 250,295 160,290 100,278"
                fill="url(#parchmentGrad)"
                stroke="#b45309"
                strokeWidth="1.5"
                opacity="0.85"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />

              {/* 4. Background Brownie Square 1 (Left Back) */}
              <g transform="translate(100, 160) scale(0.85)">
                {/* Left side face */}
                <polygon points="0,45 45,70 45,105 0,80" fill="#1b0a04" />
                {/* Right side face */}
                <polygon points="45,70 120,40 120,75 45,105" fill="#291107" />
                {/* Top face */}
                <polygon points="0,45 75,15 120,40 45,70" fill="url(#brownieCrustGrad)" stroke="#522713" strokeWidth="1" />
                {/* Crust crackle */}
                <path d="M20,40 Q40,48 55,38 T90,32" stroke="#d97706" strokeWidth="1" fill="none" opacity="0.5" />
              </g>

              {/* 5. Background Brownie Square 2 (Right Back) */}
              <g transform="translate(230, 150) scale(0.9)">
                {/* Left side face */}
                <polygon points="0,45 50,72 50,110 0,82" fill="#1b0a04" />
                {/* Right side face */}
                <polygon points="50,72 135,42 135,80 50,110" fill="#2a1208" />
                {/* Top face */}
                <polygon points="0,45 85,15 135,42 50,72" fill="url(#brownieCrustGrad)" stroke="#522713" strokeWidth="1" />
                {/* Crackles */}
                <path d="M30,42 Q60,50 80,36 T115,35" stroke="#d97706" strokeWidth="1.2" fill="none" opacity="0.6" />
                {/* Nuts on top */}
                <ellipse cx="65" cy="42" rx="7" ry="4" fill="url(#nutGrad)" transform="rotate(-15 65 42)" />
              </g>

              {/* 6. HERO FOREGROUND BROWNIE SQUARE (Center front) */}
              <g transform="translate(145, 155)">
                {/* Shadow of Hero Brownie */}
                <polygon points="0,115 70,150 175,110 105,75" fill="#000000" opacity="0.5" filter="blur(3px)" />

                {/* Left Cut Face (FUDGY MELTING INTERIOR) */}
                <polygon
                  points="0,55 70,105 70,145 0,95"
                  fill="url(#fudgyCutGrad)"
                  stroke={activeHighlight === 'fudge' ? '#38bdf8' : '#3d1a0c'}
                  strokeWidth={activeHighlight === 'fudge' ? 3 : 1}
                />
                {/* Fudgy Interior Texture Details (Gooey pockets) */}
                <g opacity="0.9">
                  {/* Dense chocolate grain */}
                  <ellipse cx="32" cy="85" rx="8" ry="4" fill="#0f0502" />
                  <ellipse cx="33" cy="85" rx="5" ry="2.5" fill="#451a09" />
                  <ellipse cx="48" cy="115" rx="10" ry="5" fill="#0e0502" />
                  <ellipse cx="20" cy="72" rx="4" ry="2.5" fill="#d97706" opacity="0.8" /> {/* interior nut piece */}
                  <ellipse cx="52" cy="128" rx="6" ry="3" fill="#140602" />
                  {/* Chocolate drip / melty edge */}
                  <path d="M38,98 C40,110 44,112 45,102" stroke="#120502" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>

                {/* Right Cut Face (FUDGY MELTING INTERIOR RIGHT) */}
                <polygon
                  points="70,105 175,60 175,100 70,145"
                  fill="url(#fudgyCutGrad)"
                  stroke={activeHighlight === 'fudge' ? '#38bdf8' : '#3d1a0c'}
                  strokeWidth={activeHighlight === 'fudge' ? 3 : 1}
                />
                {/* Right Cut Texture Details */}
                <g opacity="0.85">
                  <ellipse cx="115" cy="95" rx="12" ry="5" fill="#120603" />
                  <ellipse cx="140" cy="80" rx="7" ry="3.5" fill="#4a1c0b" />
                  <ellipse cx="92" cy="118" rx="5" ry="3" fill="#d97706" opacity="0.75" />
                  <path d="M125,88 C128,102 133,103 134,92" stroke="#0e0401" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>

                {/* TOP SURFACE: THE SIGNATURE CRACKLY GLOSSY CRUST */}
                <polygon
                  points="0,55 105,10 175,60 70,105"
                  fill="url(#brownieCrustGrad)"
                  stroke={activeHighlight === 'crust' ? '#fbbf24' : '#602a11'}
                  strokeWidth={activeHighlight === 'crust' ? 3 : 1.5}
                />

                {/* Glossy Sheen Reflection Layer */}
                <polygon
                  points="0,55 105,10 175,60 70,105"
                  fill="url(#crustSheen)"
                  className={crustShine}
                  style={{ mixBlendMode: 'screen' }}
                />

                {/* CRACKLE WEB: Fine, realistic spiderweb paper crust micro-cracks */}
                <g stroke="#fef08a" strokeWidth="0.8" opacity={isDivine ? "0.85" : isMaster ? "0.7" : "0.5"} fill="none">
                  {/* Primary Fissure 1 */}
                  <path d="M25,58 Q45,50 68,62 T110,48 T145,52" />
                  <path d="M48,52 L55,42 Q70,36 82,45" strokeWidth="0.6" />
                  <path d="M68,62 L75,76 Q85,82 92,72" strokeWidth="0.6" />

                  {/* Primary Fissure 2 */}
                  <path d="M60,32 Q85,28 115,35 T152,42" />
                  <path d="M95,30 L90,20 Q100,16 112,22" strokeWidth="0.5" />
                  <path d="M115,35 L125,48 Q138,52 142,44" strokeWidth="0.6" />

                  {/* Micro-cracks near corners */}
                  <path d="M15,62 L28,70 L22,78" strokeWidth="0.5" />
                  <path d="M130,25 L145,30 L155,22" strokeWidth="0.5" />
                  <path d="M72,95 L84,88 L98,92" strokeWidth="0.5" />
                </g>

                {/* ROASTED NUTS / FRUTOS SECOS (Toasted Chopped Walnuts & Peanuts 🥜) */}
                <g filter="drop-shadow(0 2px 2px rgba(0,0,0,0.6))">
                  {/* Nut Cluster 1 */}
                  <polygon
                    points="42,46 54,40 58,48 48,54"
                    fill="url(#nutGrad)"
                    stroke={activeHighlight === 'nuts' ? '#34d399' : '#78350f'}
                    strokeWidth={activeHighlight === 'nuts' ? 2 : 0.8}
                  />
                  <line x1="46" y1="44" x2="52" y2="50" stroke="#fef08a" strokeWidth="0.8" />

                  {/* Nut Cluster 2 (Center Hero) */}
                  <polygon
                    points="82,48 98,42 105,52 92,60"
                    fill="url(#nutGrad)"
                    stroke={activeHighlight === 'nuts' ? '#34d399' : '#78350f'}
                    strokeWidth={activeHighlight === 'nuts' ? 2 : 0.8}
                  />
                  <polygon points="90,46 95,50 88,54" fill="#fef3c7" opacity="0.8" />

                  {/* Nut Cluster 3 (Right) */}
                  <polygon
                    points="126,38 138,34 142,42 132,46"
                    fill="url(#nutGrad)"
                    stroke={activeHighlight === 'nuts' ? '#34d399' : '#78350f'}
                    strokeWidth={activeHighlight === 'nuts' ? 2 : 0.8}
                  />

                  {/* Small Nut Fragments */}
                  <ellipse cx="64" cy="74" rx="4" ry="2.5" fill="url(#nutGrad)" />
                  <ellipse cx="112" cy="70" rx="5" ry="3" fill="url(#nutGrad)" />
                  <circle cx="76" cy="36" r="2" fill="#fbbf24" />
                </g>

                {/* GOLDEN HONEY DRIZZLE & SHINE GLINTS (🍯 Miel de Hestia) */}
                <g filter="drop-shadow(0 1px 3px rgba(0,0,0,0.7))">
                  {/* Honey Stream 1 */}
                  <path
                    d="M35,48 C50,58 65,38 85,55 S120,45 140,58"
                    stroke="url(#honeyGrad)"
                    strokeWidth={activeHighlight === 'honey' ? 4.5 : 2.8}
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  {/* Specular White Highlights on Honey */}
                  <path
                    d="M40,50 C48,56 56,46 68,44"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <circle cx="85" cy="55" r="2.5" fill="#fef08a" />
                  <circle cx="85" cy="54" r="1.2" fill="#ffffff" />
                  <circle cx="125" cy="48" r="2" fill="#fef08a" />
                </g>

                {/* CINNAMON DUSTING (Fine golden-brown specks) */}
                <g fill="#b45309" opacity="0.7">
                  <circle cx="28" cy="62" r="1" />
                  <circle cx="34" cy="56" r="0.8" />
                  <circle cx="72" cy="68" r="0.9" />
                  <circle cx="102" cy="62" r="1" />
                  <circle cx="120" cy="56" r="0.8" />
                  <circle cx="135" cy="48" r="1" />
                  <circle cx="62" cy="40" r="0.7" />
                </g>

                {/* Sparkle glints on Divine quality */}
                {isDivine && (
                  <g>
                    <path
                      d="M92,38 L95,30 L98,38 L106,41 L98,44 L95,52 L92,44 L84,41 Z"
                      fill="#fef08a"
                      opacity="0.85"
                    />
                    <path
                      d="M50,65 L52,60 L54,65 L59,67 L54,69 L52,74 L50,69 L45,67 Z"
                      fill="#ffffff"
                      opacity="0.75"
                    />
                  </g>
                )}
              </g>

              {/* 7. Crumbs and Toasted Nut bits on the parchment paper */}
              <g fill="#2e1408" opacity="0.85">
                <circle cx="130" cy="265" r="2.5" />
                <circle cx="145" cy="275" r="1.8" />
                <circle cx="295" cy="260" r="3" />
                <polygon points="310,250 316,246 314,254" fill="url(#nutGrad)" />
                <circle cx="328" cy="245" r="1.5" />
                <circle cx="185" cy="285" r="2" />
                <circle cx="230" cy="288" r="1.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* Feature Badges / Interactive Inspection */}
        <div className="relative z-10 w-full mt-2 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
            <span className="flex items-center gap-1.5 font-mythic">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Inspeccionar Atributos del Brownie:
            </span>
            <span className="text-[10px] text-amber-200/60 hidden sm:inline">
              (Haz clic en cada botón para resaltar)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs">
            {/* Attribute 1: Crust */}
            <button
              onClick={() => handleInspect('crust')}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                activeHighlight === 'crust'
                  ? 'bg-amber-500 text-stone-950 border-amber-300 font-black shadow-lg scale-105'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-amber-200 border-amber-500/30'
              }`}
            >
              <span className="text-base">✨</span>
              <span className="font-bold text-[11px] mt-0.5">Corteza Craquelada</span>
              <span className="text-[9px] opacity-80">Brillante & Fina</span>
            </button>

            {/* Attribute 2: Fudge Center */}
            <button
              onClick={() => handleInspect('fudge')}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                activeHighlight === 'fudge'
                  ? 'bg-sky-500 text-stone-950 border-sky-300 font-black shadow-lg scale-105'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-amber-200 border-amber-500/30'
              }`}
            >
              <span className="text-base">🍫</span>
              <span className="font-bold text-[11px] mt-0.5">Centro Fudgy</span>
              <span className="text-[9px] opacity-80">Meloso & Húmedo</span>
            </button>

            {/* Attribute 3: Nuts */}
            <button
              onClick={() => handleInspect('nuts')}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                activeHighlight === 'nuts'
                  ? 'bg-emerald-500 text-stone-950 border-emerald-300 font-black shadow-lg scale-105'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-amber-200 border-amber-500/30'
              }`}
            >
              <span className="text-base">🥜</span>
              <span className="font-bold text-[11px] mt-0.5">Frutos Secos</span>
              <span className="text-[9px] opacity-80">Tostados al Punto</span>
            </button>

            {/* Attribute 4: Honey & Cinnamon */}
            <button
              onClick={() => handleInspect('honey')}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                activeHighlight === 'honey'
                  ? 'bg-yellow-400 text-stone-950 border-yellow-200 font-black shadow-lg scale-105'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-amber-200 border-amber-500/30'
              }`}
            >
              <span className="text-base">🍯</span>
              <span className="font-bold text-[11px] mt-0.5">Miel & Canela</span>
              <span className="text-[9px] opacity-80">Poder Curativo</span>
            </button>
          </div>

          {/* Active explanation banner */}
          {activeHighlight && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 p-2.5 rounded-xl bg-amber-950/90 border border-amber-400/50 text-[11px] text-amber-200 flex items-center gap-2"
            >
              <span className="text-sm">
                {activeHighlight === 'crust' && '✨'}
                {activeHighlight === 'fudge' && '🍫'}
                {activeHighlight === 'nuts' && '🥜'}
                {activeHighlight === 'honey' && '🍯'}
              </span>
              <span>
                {activeHighlight === 'crust' &&
                  'Corteza superior papelizada y craquelada: obtenida gracias al batido correcto del azúcar con los huevos y horneado a 175°C.'}
                {activeHighlight === 'fudge' &&
                  'Interior denso y húmedo: el chocolate y la mantequilla derretidos a fuego bajo evitan que se seque la masa.'}
                {activeHighlight === 'nuts' &&
                  'Frutos secos crocantes: tamizados e incorporados de manera homogénea para un bocado balanceado y crocante.'}
                {activeHighlight === 'honey' &&
                  'Miel de Hestia y Canela: añadidas con la mezcla tibia para preservar el calor curativo capaz de regenerar huesos.'}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
