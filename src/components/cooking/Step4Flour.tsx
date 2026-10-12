import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { StepScoreDetail } from '../../types/game';
import { sound } from '../../utils/sound';

interface Props {
  onComplete: (scoreDetail: StepScoreDetail) => void;
}

interface NutTile {
  id: number;
  isNut: boolean;
  emoji: string;
}

const OTHER_EMOJIS_STEP4 = [
  '🍫', '🥚', '🥛', '🍎', '🍓', '☕', '🍋', '🍇', '🍪', '🍒', '🍌', '🥞', '🥐'
];

const createInitialNutBoard = (): NutTile[] => {
  const nuts: NutTile[] = [
    { id: 1, isNut: true, emoji: '🥜' },
    { id: 2, isNut: true, emoji: '🥜' },
    { id: 3, isNut: true, emoji: '🥜' },
  ];
  const others: NutTile[] = OTHER_EMOJIS_STEP4.map((emoji, idx) => ({
    id: 4 + idx,
    isNut: false,
    emoji,
  }));
  return [...nuts, ...others].sort(() => Math.random() - 0.5);
};

export const Step4Flour: React.FC<Props> = ({ onComplete }) => {
  // Step Progression: 'prep' -> 'minigame' -> 'mixing'
  const [stage, setStage] = useState<'prep' | 'minigame' | 'mixing'>('prep');

  // Stage 1: Prep Ingredients (Frutos Secos y Vainilla)
  const [nutsAdded, setNutsAdded] = useState<boolean>(false);
  const [vanillaAdded, setVanillaAdded] = useState<boolean>(false);

  // Stage 2: Sifting 4x4 Mini-Game State
  const [board, setBoard] = useState<NutTile[]>(() => createInitialNutBoard());
  const [siftPhase, setSiftPhase] = useState<'preview' | 'shuffling' | 'playing' | 'completed'>('preview');
  const [previewCountdown, setPreviewCountdown] = useState<number>(4.0);
  const [shuffleStep, setShuffleStep] = useState<number>(1); // 1, 2, or 3
  const [isShuffleRevealed, setIsShuffleRevealed] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [wrongRevealedId, setWrongRevealedId] = useState<number | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  // Stage 3: Bowl & Mixing State
  const [flourRemnants, setFlourRemnants] = useState<number>(100);
  const [isFolding, setIsFolding] = useState<boolean>(false);

  // Add Ingredients Handlers
  const handleAddNuts = () => {
    if (nutsAdded) return;
    sound.playMagicBlessing();
    setNutsAdded(true);
  };

  const handleAddVanilla = () => {
    if (vanillaAdded) return;
    sound.playMagicBlessing();
    setVanillaAdded(true);
  };

  // Start 4x4 Mini-Game after both ingredients are placed
  const handleStartMinigame = () => {
    sound.playClick();
    setStage('minigame');
    setSiftPhase('preview');
    setPreviewCountdown(4.0);
  };

  // 1. 4-Second Preview Countdown (only when in minigame stage and preview phase)
  useEffect(() => {
    if (stage !== 'minigame' || siftPhase !== 'preview') return;

    const interval = 100;
    const timer = setInterval(() => {
      setPreviewCountdown((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          clearInterval(timer);
          setSiftPhase('shuffling');
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stage, siftPhase]);

  // 2. Triple Shuffle Sequence with 1-second reveal after each shuffle
  useEffect(() => {
    if (stage !== 'minigame' || siftPhase !== 'shuffling') return;

    const timers: NodeJS.Timeout[] = [];

    // --- Shuffle 1 ---
    setShuffleStep(1);
    setIsShuffleRevealed(false);
    sound.playWhisk();
    setBoard((current) => [...current].sort(() => Math.random() - 0.5));

    // Reveal 1 (after movement settles at 500ms, shown for 1.0s)
    timers.push(
      setTimeout(() => {
        setIsShuffleRevealed(true);
        sound.playClick();
      }, 500)
    );

    // --- Shuffle 2 --- (at 1500ms: flips down and shuffles again)
    timers.push(
      setTimeout(() => {
        setShuffleStep(2);
        setIsShuffleRevealed(false);
        sound.playWhisk();
        setBoard((current) => [...current].sort(() => Math.random() - 0.5));
      }, 1500)
    );

    // Reveal 2 (after movement settles at 2000ms, shown for 1.0s)
    timers.push(
      setTimeout(() => {
        setIsShuffleRevealed(true);
        sound.playClick();
      }, 2000)
    );

    // --- Shuffle 3 --- (at 3000ms: flips down and shuffles again)
    timers.push(
      setTimeout(() => {
        setShuffleStep(3);
        setIsShuffleRevealed(false);
        sound.playWhisk();
        setBoard((current) => [...current].sort(() => Math.random() - 0.5));
      }, 3000)
    );

    // Reveal 3 (after movement settles at 3500ms, shown for 1.0s)
    timers.push(
      setTimeout(() => {
        setIsShuffleRevealed(true);
        sound.playClick();
      }, 3500)
    );

    // --- End of Shuffles & Start Playing --- (at 4500ms: flips down to flame & enables play)
    timers.push(
      setTimeout(() => {
        setIsShuffleRevealed(false);
        sound.playClick();
        setSiftPhase('playing');
      }, 4500)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [stage, siftPhase]);

  // Handle tile click in the 4x4 sifting board
  const handleTileClick = (tile: NutTile) => {
    if (siftPhase !== 'playing' || revealedIds.includes(tile.id) || wrongRevealedId !== null) return;

    if (tile.isNut) {
      sound.playClick();
      const updatedRevealed = [...revealedIds, tile.id];
      setRevealedIds(updatedRevealed);

      // Check if all 3 nuts found!
      if (updatedRevealed.length === 3) {
        sound.playMagicBlessing();
        setSiftPhase('completed');
        // Proceed to mixing stage after a brief moment
        setTimeout(() => {
          setStage('mixing');
        }, 900);
      }
    } else {
      // Wrong tile!
      sound.playSizzle();
      setWrongRevealedId(tile.id);
      setMistakesCount((prev) => prev + 1);

      setTimeout(() => {
        setWrongRevealedId(null);
      }, 700);
    }
  };

  const nutsFound = revealedIds.length;

  // Correct: Gentle folding
  const handleFold = () => {
    if (flourRemnants <= 0) return;
    sound.playWhisk();
    setIsFolding(true);
    setFlourRemnants((prev) => {
      const next = prev - 25;
      if (next <= 0) {
        sound.playMagicBlessing();
        return 0;
      }
      return next;
    });
    setTimeout(() => setIsFolding(false), 200);
  };

  const isComplete = stage === 'mixing' && flourRemnants <= 0;

  const handleFinishStep = () => {
    sound.playClick();

    const correctActions: string[] = [];
    const incorrectActions: string[] = [];
    let score = 0;

    // 1. Ingredients Prep (required prep, 0 pts)
    if (nutsAdded) {
      correctActions.push('Añadiste los frutos secos a la masa');
    }
    if (vanillaAdded) {
      correctActions.push('Añadiste la fragante esencia de vainilla');
    }

    // 2. Sifting minigame (exclusively awards all 12 points!)
    if (mistakesCount === 0) {
      score = 12;
      correctActions.push('¡Puntaje Máximo en el Juego del Tamiz! Encontraste los 3 frutos secos tras el triple barajeo sin fallos (+12 pts)');
    } else if (mistakesCount === 1) {
      score = 10;
      correctActions.push('Gran memoria en el juego del tamiz: encontraste los 3 frutos secos con 1 fallo (+10 pts)');
      incorrectActions.push('Tuviste 1 fallo al localizar los frutos secos en el tamiz');
    } else if (mistakesCount === 2) {
      score = 8;
      correctActions.push('Buen desempeño en el tamiz: completado con 2 fallos (+8 pts)');
      incorrectActions.push('Tuviste 2 fallos al localizar los frutos secos en el tamiz');
    } else if (mistakesCount === 3) {
      score = 5;
      correctActions.push('Tamiz completado con 3 fallos (+5 pts)');
      incorrectActions.push('Tuviste 3 fallos al buscar los frutos secos tras el triple barajeo');
    } else {
      score = 2;
      correctActions.push(`Tamiz completado con ${mistakesCount} fallos (+2 pts)`);
      incorrectActions.push(`Tuviste ${mistakesCount} fallos al buscar los frutos secos tras el triple barajeo`);
    }

    // 3. Gentle folding (secondary step, 0 pts bonus)
    if (flourRemnants <= 0) {
      correctActions.push('Mezclaste suavemente con movimientos envolventes sin sobrebatir');
    }

    onComplete({
      stepIndex: 3,
      stepName: 'Paso 4: Frutos Secos, Harina y Mezcla Suave',
      score: Math.max(1, Math.min(12, score)),
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
            Paso 4 de 5 • Máx. 12 Puntos
          </span>
          <span className="text-xs font-medium text-amber-800 flex items-center gap-1 font-mythic">
            <Sparkles className="w-3.5 h-3.5" /> El Tamiz Sagrado de Hestia
          </span>
        </div>
        <h3 className="text-xl font-bold font-mythic text-amber-950">
          Paso 4 — Los frutos secos y la harina
        </h3>
        <p className="text-sm text-stone-700 mt-1">
          Primero, añade los <strong className="text-stone-900">frutos secos (🥜)</strong> y la <strong className="text-stone-900">vainilla (🌸)</strong>. Luego inicia el tamizado con el tablero de <strong>4x4</strong>, donde tras un triple barajeo deberás encontrar los <strong className="text-stone-900">3 frutos secos</strong>. Finalmente, mezcla suavemente hasta que no queden restos de harina.
        </p>
      </div>

      {/* Main Station */}
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-amber-50 rounded-3xl border-4 border-amber-300 p-4 sm:p-6 shadow-xl flex flex-col items-center">

        {/* ======================================================== */}
        {/* STAGE 1: INGREDIENTS PREP (FRUTOS SECOS Y VAINILLA)     */}
        {/* ======================================================== */}
        {stage === 'prep' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header info */}
            <div className="w-full bg-white/95 p-4 rounded-2xl border-2 border-amber-200 shadow-sm mb-4">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Fase 1: Preparación de Ingredientes
              </span>
              <h4 className="text-base font-bold text-stone-900 font-mythic mt-0.5">
                Añade los Frutos Secos y la Vainilla
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Incorpora estos ingredientes del bolsito sagrado antes de activar el minijuego de tamizado.
              </p>
            </div>

            {/* Ingredient Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleAddNuts}
                disabled={nutsAdded}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  nutsAdded
                    ? 'bg-amber-100/70 border-emerald-400 text-emerald-900 shadow-inner'
                    : 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 border-amber-300 shadow-lg cursor-pointer'
                }`}
              >
                <span className="text-4xl mb-1.5">🥜</span>
                <span className="font-bold text-xs uppercase tracking-wide">
                  {nutsAdded ? '✓ Frutos Secos Añadidos' : '+ Añadir Frutos Secos'}
                </span>
                <span className="text-[10px] mt-0.5 opacity-80">
                  {nutsAdded ? 'Listos para tamizar' : 'Tostados y crujientes'}
                </span>
              </button>

              <button
                onClick={handleAddVanilla}
                disabled={vanillaAdded}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  vanillaAdded
                    ? 'bg-pink-100/70 border-emerald-400 text-emerald-900 shadow-inner'
                    : 'bg-gradient-to-b from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white border-pink-300 shadow-lg cursor-pointer'
                }`}
              >
                <span className="text-4xl mb-1.5">🌸</span>
                <span className="font-bold text-xs uppercase tracking-wide">
                  {vanillaAdded ? '✓ Vainilla Añadida' : '+ Añadir Vainilla'}
                </span>
                <span className="text-[10px] mt-0.5 opacity-80">
                  {vanillaAdded ? 'Aroma incorporado' : 'Esencia aromática'}
                </span>
              </button>
            </div>

            {/* Checklist / Requirement Notice */}
            {(!nutsAdded || !vanillaAdded) ? (
              <div className="w-full p-3 rounded-xl bg-amber-100/60 border border-amber-300 text-center text-xs text-amber-950">
                <span>
                  Coloca ambos ingredientes para desbloquear el <strong>Minijuego de Tamizado</strong>.
                </span>
              </div>
            ) : (
              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartMinigame}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Comenzar Minijuego de Tamizado (Tablero 4x4)</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: 4x4 SIFTING MINI-GAME (FRUTOS SECOS & BARAJEOS) */}
        {/* ======================================================== */}
        {stage === 'minigame' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Status Header */}
            <div className="w-full bg-stone-900 text-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-lg mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {siftPhase === 'preview'
                      ? '👀'
                      : siftPhase === 'shuffling'
                      ? isShuffleRevealed
                        ? '👀'
                        : '🌪️'
                      : '🥜'}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      {siftPhase === 'preview'
                        ? '¡Memoriza los 3 frutos secos! (4 segundos)'
                        : siftPhase === 'shuffling'
                        ? isShuffleRevealed
                          ? `¡Observa! Tras cambio ${shuffleStep} de 3 (1 segundo)`
                          : `¡Cambiando de posición... (${shuffleStep}/3)!`
                        : 'Encuentra los 3 Frutos Secos (🥜)'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {siftPhase === 'preview'
                        ? `Se voltearán a llama (🔥) y cambiarán 3 veces en ${previewCountdown.toFixed(1)}s`
                        : siftPhase === 'shuffling'
                        ? isShuffleRevealed
                          ? 'Fichas visibles por 1 segundo 👀'
                          : `Barajeo ${shuffleStep} de 3 en marcha...`
                        : `Fallos: ${mistakesCount}`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {siftPhase === 'preview' ? (
                    <span className="text-lg font-black font-mono text-amber-400">
                      {previewCountdown.toFixed(1)}s
                    </span>
                  ) : siftPhase === 'shuffling' ? (
                    <span className="text-xs font-bold text-orange-400 animate-pulse">
                      {isShuffleRevealed ? `👀 Visible 1.0s (${shuffleStep}/3)` : `Cambio ${shuffleStep}/3`}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">
                      {nutsFound} / 3 Frutos Secos 🥜
                    </span>
                  )}
                </div>
              </div>

              {/* Progress counter */}
              <div className="pt-1 border-t border-stone-800 text-xs flex items-center justify-between">
                <span className="text-stone-300">
                  Objetivo: <strong className="text-amber-300">3 Frutos Secos 🥜</strong>
                </span>
                <span className="font-bold text-emerald-300">
                  {nutsFound === 3 ? '¡Completado!' : `${3 - nutsFound} restantes`}
                </span>
              </div>
            </div>

            {/* 4x4 Sifting Grid (16 Tiles with Layout Animation) */}
            <div className="grid grid-cols-4 gap-2.5 p-3 bg-stone-950/90 rounded-3xl border-2 border-amber-600/60 shadow-2xl">
              {board.map((tile) => {
                const isFound = revealedIds.includes(tile.id);
                const isWrongFlipped = wrongRevealedId === tile.id;
                const isFaceUp =
                  siftPhase === 'preview' ||
                  (siftPhase === 'shuffling' && isShuffleRevealed) ||
                  isFound ||
                  isWrongFlipped;

                return (
                  <motion.button
                    layout
                    key={tile.id}
                    transition={{ layout: { type: 'spring', stiffness: 220, damping: 20 } }}
                    whileHover={{ scale: siftPhase === 'playing' && !isFound ? 1.05 : 1 }}
                    whileTap={{ scale: siftPhase === 'playing' && !isFound ? 0.95 : 1 }}
                    onClick={() => handleTileClick(tile)}
                    disabled={siftPhase !== 'playing' || isFound}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex items-center justify-center text-3xl sm:text-4xl shadow-md transition-colors select-none ${
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
                      /* Back side of all 16 tiles has the flame emoji 🔥 */
                      <span className="text-2xl sm:text-3xl drop-shadow">🔥</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-500 text-center mt-3">
              Tamiz sagrado: al cumplirse los 4 segundos, las fichas se voltean a llama (🔥), cambian 3 veces y se muestran 1 segundo tras cada barajeo.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: MIXING STATION (AFTER SIFTING COMPLETED)        */}
        {/* ======================================================== */}
        {stage === 'mixing' && (
          <div className="w-full flex flex-col items-center">
            {/* Sifting Success Banner */}
            <div className="w-full mb-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-emerald-950">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-xl">
                  🥜
                </div>
                <div>
                  <span className="text-xs font-bold block text-emerald-900">
                    ¡Frutos Secos y Harina Tamizados con Éxito! ✓
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Encontraste los 3 frutos secos tras el triple barajeo ({mistakesCount} fallos).
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                {mistakesCount === 0
                  ? '+12 pts (Máx)'
                  : mistakesCount === 1
                  ? '+10 pts'
                  : mistakesCount === 2
                  ? '+8 pts'
                  : mistakesCount === 3
                  ? '+5 pts'
                  : '+2 pts'}
              </span>
            </div>

            {/* Bowl Visual */}
            <div className="relative w-72 h-64 flex flex-col items-center justify-center my-2">
              <div className="relative w-64 h-48 rounded-b-[100px] bg-gradient-to-b from-stone-50 via-amber-100 to-amber-200 border-4 border-amber-300/90 shadow-2xl flex items-center justify-center overflow-hidden">
                <div
                  className="w-56 h-36 rounded-b-[80px] flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: flourRemnants === 0 ? '#1f0d05' : '#331508',
                  }}
                >
                  {flourRemnants > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-44 h-24 rounded-full border-4 border-dashed border-stone-200/70 flex items-center justify-center"
                        style={{ opacity: flourRemnants / 100 }}
                      >
                        <div className="w-28 h-12 rounded-full bg-amber-100/40 border border-stone-200/50"></div>
                      </div>
                    </div>
                  )}

                  {flourRemnants === 0 && (
                    <div className="flex flex-col items-center justify-center text-amber-300">
                      <Sparkles className="w-8 h-8 animate-pulse text-amber-400 mb-1" />
                      <span className="text-xs font-extrabold text-amber-100 tracking-wider">
                        MASA SEDOSA LISTA
                      </span>
                    </div>
                  )}
                </div>

                {flourRemnants > 0 && (
                  <motion.div
                    animate={{
                      rotate: isFolding ? [-25, 25, -25] : -10,
                      x: isFolding ? [-6, 6, -6] : 0,
                    }}
                    className="absolute z-20 top-2 right-14 w-5 h-28 bg-gradient-to-b from-amber-200 to-amber-800 rounded-b-xl border border-amber-900/60 shadow-md origin-top cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Flour Remnants Progress */}
            <div className="w-full max-w-md mt-4">
              <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
                <span>Restos de Harina sin Mezclar</span>
                <span className={`font-bold ${flourRemnants === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {flourRemnants === 0 ? '¡0% Restos (Integrada!)' : `${flourRemnants}% Harina visible`}
                </span>
              </div>
              <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-800 rounded-full transition-all duration-300"
                  style={{ width: `${100 - flourRemnants}%` }}
                />
              </div>
            </div>

            {/* Mixing Options */}
            <div className="w-full max-w-md mt-6 flex flex-col gap-3">
              {flourRemnants > 0 && (
                <div className="w-full">
                  <button
                    onClick={handleFold}
                    className="w-full py-4 px-4 rounded-2xl bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>🥄</span> Mezclar suavemente con movimientos envolventes (-25% restos)
                  </button>
                </div>
              )}

              {isComplete && (
                <button
                  onClick={handleFinishStep}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:from-emerald-500"
                >
                  <CheckCircle className="w-5 h-5" />
                  Completar Paso 4 e Ir al Paso 5 (El Horno)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
