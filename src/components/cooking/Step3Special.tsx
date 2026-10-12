import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Thermometer, Sparkles, CheckCircle, Wind, AlertCircle, Eye, Flame } from 'lucide-react';
import { StepScoreDetail } from '../../types/game';
import { sound } from '../../utils/sound';

interface Props {
  onComplete: (scoreDetail: StepScoreDetail) => void;
}

interface TileItem {
  id: number;
  type: 'honey' | 'ice' | 'cinnamon' | 'other';
  emoji: string;
  name: string;
  isTarget: boolean;
}

const OTHER_EMOJIS = [
  '🍫', '🥚', '🌾', '🥛', '🍎', '🍓', '☕', '🍋', '🍇', '🍪',
  '🍒', '🍌', '🍉', '🍍', '🍊', '🍞', '🥞', '🥐', '🍑', '🍐',
  '🧀', '🥕', '🌽', '🥥', '🧁'
];

// Helper to generate and shuffle the 5x5 board (25 tiles: 6 targets + 19 other tiles)
const createShuffledBoard = (): TileItem[] => {
  const targets: TileItem[] = [
    { id: 1, type: 'honey', emoji: '🍯', name: 'Miel', isTarget: true },
    { id: 2, type: 'honey', emoji: '🍯', name: 'Miel', isTarget: true },
    { id: 3, type: 'ice', emoji: '🧊', name: 'Hielo', isTarget: true },
    { id: 4, type: 'ice', emoji: '🧊', name: 'Hielo', isTarget: true },
    { id: 5, type: 'cinnamon', emoji: '🧂', name: 'Canela', isTarget: true },
    { id: 6, type: 'cinnamon', emoji: '🧂', name: 'Canela', isTarget: true },
  ];

  // Pick 19 distinct other emojis
  const shuffledOthers = [...OTHER_EMOJIS].sort(() => Math.random() - 0.5);
  const others: TileItem[] = shuffledOthers.slice(0, 19).map((emoji, idx) => ({
    id: 7 + idx,
    type: 'other',
    emoji,
    name: 'Otro',
    isTarget: false,
  }));

  // Combine and shuffle all 25 tiles
  return [...targets, ...others].sort(() => Math.random() - 0.5);
};

export const Step3Special: React.FC<Props> = ({ onComplete }) => {
  // Phase 1: Leveling temperature (required, but gives 0 pts)
  const [temperature, setTemperature] = useState<number>(68); // Starts hot at 68°C
  const [honeyAdded, setHoneyAdded] = useState<boolean>(false);
  const [cinnamonAdded, setCinnamonAdded] = useState<boolean>(false);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Phase 2: 5x5 Memory Board
  const [board, setBoard] = useState<TileItem[]>(() => createShuffledBoard());
  const [memoryPhase, setMemoryPhase] = useState<'preview' | 'playing' | 'completed'>('preview');
  const [previewCountdown, setPreviewCountdown] = useState<number>(3.0); // 3 seconds preview
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [wrongRevealedId, setWrongRevealedId] = useState<number | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  const isOptimalWarm = temperature >= 38 && temperature <= 46;
  const isTooHot = temperature > 46;
  const bothIngredientsAdded = honeyAdded && cinnamonAdded;

  // Level temperature handler (no points awarded)
  const handleCoolDown = () => {
    sound.playClick();
    setWarningMsg(null);
    setTemperature((prev) => Math.max(prev - 8, 40));
  };

  const handleAddHoney = () => {
    if (honeyAdded) return;
    if (isTooHot) {
      sound.playClick();
      setWarningMsg('⚠️ La mezcla debe estar tibia para incorporar la miel. Nivela la temperatura primero.');
      return;
    }
    sound.playMagicBlessing();
    setWarningMsg(null);
    setHoneyAdded(true);
  };

  const handleAddCinnamon = () => {
    if (cinnamonAdded) return;
    if (isTooHot) {
      sound.playClick();
      setWarningMsg('⚠️ La mezcla debe estar tibia para incorporar la canela. Nivela la temperatura primero.');
      return;
    }
    sound.playMagicBlessing();
    setWarningMsg(null);
    setCinnamonAdded(true);
  };

  // 3-second preview countdown timer when ingredients are added
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bothIngredientsAdded && memoryPhase === 'preview') {
      const interval = 100; // update every 100ms
      timer = setInterval(() => {
        setPreviewCountdown((prev) => {
          const next = prev - interval / 1000;
          if (next <= 0) {
            clearInterval(timer);
            sound.playClick();
            setMemoryPhase('playing');
            return 0;
          }
          return next;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [bothIngredientsAdded, memoryPhase]);

  // Handle tile click during memory game
  const handleTileClick = (tile: TileItem) => {
    if (memoryPhase !== 'playing' || revealedIds.includes(tile.id) || wrongRevealedId !== null) return;

    if (tile.isTarget) {
      // Correct target tile!
      sound.playClick();
      const updatedRevealed = [...revealedIds, tile.id];
      setRevealedIds(updatedRevealed);

      // Check if all 6 targets found (2 honey + 2 ice + 2 cinnamon)
      if (updatedRevealed.length === 6) {
        sound.playMagicBlessing();
        setMemoryPhase('completed');
      }
    } else {
      // Wrong tile! Show briefly, count mistake, then flip back
      sound.playSizzle();
      setWrongRevealedId(tile.id);
      setMistakesCount((prev) => prev + 1);

      setTimeout(() => {
        setWrongRevealedId(null);
      }, 750);
    }
  };

  // Target counters
  const foundHoney = board.filter((t) => t.type === 'honey' && revealedIds.includes(t.id)).length;
  const foundIce = board.filter((t) => t.type === 'ice' && revealedIds.includes(t.id)).length;
  const foundCinnamon = board.filter((t) => t.type === 'cinnamon' && revealedIds.includes(t.id)).length;

  // Complete step and calculate score
  const handleFinishStep = () => {
    sound.playClick();

    const correctActions: string[] = [];
    const incorrectActions: string[] = [];
    let score = 0;

    // Memory Board Score (Max 12 pts)
    if (mistakesCount === 0) {
      score = 12;
      correctActions.push('¡Memoria Divina Inmaculada! Encontraste las 6 fichas (2 miel, 2 hielo, 2 canela) con 0 fallos (+12 pts)');
    } else if (mistakesCount === 1) {
      score = 10;
      correctActions.push('Excelente memoria: encontraste las 6 fichas con solo 1 fallo (+10 pts)');
      incorrectActions.push('Tuviste 1 error al voltear las fichas');
    } else if (mistakesCount === 2) {
      score = 8;
      correctActions.push('Buena memoria: completaste el tablero con 2 fallos (+8 pts)');
      incorrectActions.push('Tuviste 2 errores al voltear las fichas');
    } else if (mistakesCount === 3) {
      score = 6;
      correctActions.push('Tablero completado con 3 fallos (+6 pts)');
      incorrectActions.push('Tuviste 3 errores en el tablero');
    } else {
      score = 4;
      correctActions.push(`Tablero completado con ${mistakesCount} fallos (+4 pts)`);
      incorrectActions.push(`Cometiste ${mistakesCount} errores al recordar las posiciones`);
    }

    onComplete({
      stepIndex: 2,
      stepName: 'Paso 3: El Ingrediente Especial (Tablero de Memoria)',
      score: Math.max(1, score),
      maxScore: 12,
      correctActions,
      incorrectActions,
    });
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* Banner */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 shadow-sm mb-6 text-stone-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full font-mythic">
            Paso 3 de 5 • Máx. 12 Puntos
          </span>
          <span className="text-xs font-medium text-amber-800 flex items-center gap-1 font-mythic">
            <Sparkles className="w-3.5 h-3.5" /> El Secreto de Hestia
          </span>
        </div>
        <h3 className="text-xl font-bold font-mythic text-amber-950">
          Paso 3 — El ingrediente especial
        </h3>
        <p className="text-sm text-stone-700 mt-1">
          Nivela la temperatura a tibia para añadir los ingredientes. Luego aparecerá un <strong className="text-amber-900">tablero de 5x5</strong>: memoriza durante 3 segundos antes de que se volteen a <strong className="text-orange-700">fuego (🔥)</strong>. Encuentra: <strong className="text-stone-900">2 de miel (🍯)</strong>, <strong className="text-stone-900">2 de hielo (🧊)</strong> y <strong className="text-stone-900">2 de canela (🧂)</strong>.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-amber-50 rounded-3xl border-4 border-amber-300 p-4 sm:p-6 shadow-xl flex flex-col items-center">
        {warningMsg && (
          <div className="mb-4 w-full bg-amber-100 border border-amber-400 rounded-xl p-3 text-amber-950 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{warningMsg}</span>
          </div>
        )}

        {/* Phase 1: Leveling temperature & adding ingredients */}
        {!bothIngredientsAdded && (
          <div className="w-full flex flex-col items-center">
            {/* Temperature Monitor */}
            <div className="w-full max-w-md bg-white/90 p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  isOptimalWarm
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 animate-pulse'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    Temperatura de la Mezcla
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-800">
                      {temperature}°C
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isOptimalWarm
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isOptimalWarm ? '✨ Tibia (Lista)' : 'Caliente (>46°C)'}
                    </span>
                  </div>
                </div>
              </div>

              {isTooHot && (
                <button
                  onClick={handleCoolDown}
                  className="py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Wind className="w-4 h-4 text-sky-600" />
                  Nivelar Temperatura
                </button>
              )}
            </div>

            {/* Ingredients Shelf */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 my-2">
              <button
                onClick={handleAddHoney}
                disabled={honeyAdded}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  honeyAdded
                    ? 'bg-amber-100/60 border-amber-300 text-stone-600 opacity-60'
                    : 'bg-amber-500 hover:bg-amber-400 text-amber-950 border-amber-300 shadow-lg cursor-pointer'
                }`}
              >
                <span className="text-3xl mb-1">🍯</span>
                <span className="font-bold text-xs uppercase tracking-wide">
                  {honeyAdded ? 'Miel Añadida ✓' : '+ Añadir Miel'}
                </span>
              </button>

              <button
                onClick={handleAddCinnamon}
                disabled={cinnamonAdded}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  cinnamonAdded
                    ? 'bg-amber-100/60 border-amber-300 text-stone-600 opacity-60'
                    : 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400 shadow-lg cursor-pointer'
                }`}
              >
                <span className="text-3xl mb-1">🧂</span>
                <span className="font-bold text-xs uppercase tracking-wide">
                  {cinnamonAdded ? 'Canela Añadida ✓' : '+ Añadir Canela'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: 5x5 Memory Board of Hestia (25 Tiles) */}
        {bothIngredientsAdded && (
          <div className="w-full max-w-lg flex flex-col items-center">
            {/* Status bar */}
            <div className="w-full bg-stone-900 text-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-lg mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {memoryPhase === 'preview' ? '👀' : memoryPhase === 'completed' ? '👑' : '🔥'}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      {memoryPhase === 'preview'
                        ? '¡Memoriza las fichas! (3 segundos)'
                        : memoryPhase === 'completed'
                        ? '¡Tablero Completado!'
                        : 'Encuentra las 6 Fichas Objetivo'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {memoryPhase === 'preview'
                        ? `Las fichas se voltearán en ${previewCountdown.toFixed(1)}s`
                        : `Fallos: ${mistakesCount}`}
                    </span>
                  </div>
                </div>

                {/* Countdown bar or score */}
                <div className="text-right">
                  {memoryPhase === 'preview' ? (
                    <span className="text-lg font-black font-mono text-amber-400">
                      {previewCountdown.toFixed(1)}s
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">
                      {revealedIds.length} / 6 Encontradas
                    </span>
                  )}
                </div>
              </div>

              {/* Targets checklist */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-800 text-center text-xs">
                <div className={`p-1.5 rounded-lg border ${
                  foundHoney === 2
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300'
                }`}>
                  <span>🍯 Miel: {foundHoney}/2</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  foundIce === 2
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300'
                }`}>
                  <span>🧊 Hielo: {foundIce}/2</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  foundCinnamon === 2
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300'
                }`}>
                  <span>🧂 Canela: {foundCinnamon}/2</span>
                </div>
              </div>
            </div>

            {/* 5x5 Grid (25 Tiles) */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-stone-950/90 rounded-3xl border-2 border-amber-600/60 shadow-2xl">
              {board.map((tile) => {
                const isFound = revealedIds.includes(tile.id);
                const isWrongFlipped = wrongRevealedId === tile.id;
                const isFaceUp = memoryPhase === 'preview' || isFound || isWrongFlipped;

                return (
                  <motion.button
                    key={tile.id}
                    whileHover={{ scale: memoryPhase === 'playing' && !isFound ? 1.05 : 1 }}
                    whileTap={{ scale: memoryPhase === 'playing' && !isFound ? 0.95 : 1 }}
                    onClick={() => handleTileClick(tile)}
                    disabled={memoryPhase !== 'playing' || isFound}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-md transition-all select-none ${
                      isFaceUp
                        ? isFound
                          ? 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                          : isWrongFlipped
                          ? 'bg-rose-100 border-rose-400'
                          : 'bg-white border-stone-200'
                        : 'bg-gradient-to-br from-amber-900 via-stone-900 to-orange-950 border-orange-500/70 hover:border-amber-400 cursor-pointer shadow-inner'
                    }`}
                  >
                    {isFaceUp ? (
                      <span>{tile.emoji}</span>
                    ) : (
                      /* Back side of all 25 tiles has the fire emoji 🔥 */
                      <span className="text-xl sm:text-2xl drop-shadow">🔥</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Completion & Next button */}
            {memoryPhase === 'completed' && (
              <div className="w-full max-w-md mt-6 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center gap-3">
                  <div className="text-2xl">👑</div>
                  <div className="text-xs">
                    <span className="font-bold text-sm block">
                      ¡Tablero Completado!
                    </span>
                    <span>
                      Encontraste los 2 de miel, 2 de hielo y 2 de canela con {mistakesCount} fallos.
                      {mistakesCount === 0 ? ' ¡Máxima puntuación (+12 pts)!' : ' Buen desempeño.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFinishStep}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" />
                  Completar Paso 3 e Ir al Paso 4 (La Harina)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

