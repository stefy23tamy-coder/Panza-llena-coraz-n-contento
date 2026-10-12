import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle, Sparkles, Clock, EyeOff } from 'lucide-react';
import { StepScoreDetail } from '../../types/game';
import { sound } from '../../utils/sound';

interface Props {
  onComplete: (scoreDetail: StepScoreDetail) => void;
}

// Exact times: 8, 9, 10, 11, 12, 13, 14, 15, 16
const EXACT_DURATIONS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const getRandomDuration = () => {
  return EXACT_DURATIONS[Math.floor(Math.random() * EXACT_DURATIONS.length)];
};

export const Step1Melt: React.FC<Props> = ({ onComplete }) => {
  // Ingredients in pot (only white chocolate and white butter)
  const [hasChocolate, setHasChocolate] = useState<boolean>(false);
  const [hasButter, setHasButter] = useState<boolean>(false);

  // Random total duration between 8.0s and 16.0s
  const [totalDuration, setTotalDuration] = useState<number>(getRandomDuration);
  const halfwaySeconds = totalDuration / 2;

  // Countdown timer states
  const [isFireActive, setIsFireActive] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(totalDuration);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [stoppedAtDiff, setStoppedAtDiff] = useState<number | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const bothInPot = hasChocolate && hasButter;

  // Add ingredients
  const handleAddChocolate = () => {
    sound.playClick();
    setHasChocolate(true);
  };

  const handleAddButter = () => {
    sound.playClick();
    setHasButter(true);
  };

  // Start fire & countdown
  const handleStartFire = () => {
    if (!bothInPot || isFireActive || isStopped) return;
    sound.playClick();
    sound.playSizzle();
    setIsFireActive(true);
    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsedSeconds = (now - startTimeRef.current) / 1000;
      const remaining = totalDuration - elapsedSeconds;

      setTimeRemaining(remaining);

      // Keep running past 0 so overshoot can be evaluated
      if (remaining > -8) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        handleStopFire();
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  // Stop the fire
  const handleStopFire = () => {
    if (!isFireActive || isStopped) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    sound.playClick();
    setIsFireActive(false);
    setIsStopped(true);

    const diff = timeRemaining;
    setStoppedAtDiff(diff);

    if (Math.abs(diff) <= 0.4) {
      sound.playMagicBlessing();
    } else {
      sound.playSizzle();
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // When time reaches halfway (50%), the bar becomes transparent!
  // It only becomes visible again when stopped.
  const isPastHalfway = timeRemaining <= halfwaySeconds;
  const isBarTransparent = isPastHalfway && !isStopped;

  // Real-time percentage of remaining time (100% down to 0%)
  const rawPercent = (timeRemaining / totalDuration) * 100;
  const clampedPercent = Math.max(0, Math.min(100, rawPercent));

  // Finish step and send evaluation score
  const handleFinishStep = () => {
    sound.playClick();

    const correctActions: string[] = [];
    const incorrectActions: string[] = [];
    let score = 0;

    // Both in pot (required prep, 0 pts)
    if (hasChocolate && hasButter) {
      correctActions.push('Pusiste el chocolate y la mantequilla en la cazuela');
    }

    const diff = stoppedAtDiff ?? 0;
    const absDiff = Math.abs(diff);

    // All 12 points come exclusively from the countdown minigame
    if (absDiff <= 0.35) {
      score = 12;
      correctActions.push(`¡Precisión Divina en el Juego! Detuviste la barra a solo ${absDiff.toFixed(2)}s de 0 (+12 pts)`);
    } else if (absDiff <= 0.8) {
      score = 10;
      correctActions.push(`Muy buena intuición en el juego: detuviste a ${absDiff.toFixed(2)}s de 0 (+10 pts)`);
    } else if (absDiff <= 1.5) {
      score = 7;
      correctActions.push(`Buen cálculo en el juego: detuviste a ${absDiff.toFixed(2)}s de 0 (+7 pts)`);
      if (diff > 0) {
        incorrectActions.push(`Pulsaste ${diff.toFixed(2)}s antes de tiempo`);
      } else {
        incorrectActions.push(`Pulsaste ${Math.abs(diff).toFixed(2)}s después de 0`);
      }
    } else if (absDiff <= 2.5) {
      score = 4;
      correctActions.push(`Juego completado con desvío de ${absDiff.toFixed(2)}s (+4 pts)`);
      if (diff > 0) {
        incorrectActions.push(`Pulsaste con ${diff.toFixed(2)}s de antelación`);
      } else {
        incorrectActions.push(`Pulsaste ${Math.abs(diff).toFixed(2)}s después de 0`);
      }
    } else {
      score = 1;
      incorrectActions.push(`Gran desvío en el juego del fuego (${absDiff.toFixed(2)}s de 0, +1 pt)`);
    }

    onComplete({
      stepIndex: 0,
      stepName: 'Paso 1: Derretir Chocolate y Mantequilla',
      score: Math.max(1, Math.min(12, score)),
      maxScore: 12,
      correctActions,
      incorrectActions,
    });
  };

  // Melt visual in pot based on time
  const elapsed = totalDuration - timeRemaining;
  const meltVisualPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* Banner */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 shadow-sm mb-6 text-stone-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Paso 1 de 5 • Máx. 12 Puntos
          </span>
          <span className="text-xs font-medium text-amber-900 font-mythic">
            Reto de Barra Transparente ({totalDuration}s)
          </span>
        </div>
        <h3 className="text-xl font-bold font-mythic text-amber-950">
          Paso 1 — Derretir
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          Coloca el <strong className="text-stone-900">chocolate blanco</strong> y la <strong className="text-stone-900">mantequilla blanca</strong>. Al prender el fuego verás la barra disminuir en tiempo real. <span className="font-semibold text-amber-950 underline decoration-amber-400">A la mitad ({halfwaySeconds.toFixed(1)}s) la barra se volverá transparente</span>: ¡pulsa cuando creas que llegó a 0!
        </p>
      </div>

      {/* Main Station */}
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-amber-50 rounded-3xl border-4 border-amber-200 p-6 shadow-xl flex flex-col items-center">
        {/* Ingredient Shelf (Only Emojis for Chocolate and Butter, in pure white) */}
        {!bothInPot && (
          <div className="w-full mb-4 bg-white/95 p-4 rounded-2xl border-2 border-stone-200 shadow-md flex flex-col items-center">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-3">
              Ingredientes para la Cazuela:
            </span>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleAddChocolate}
                disabled={hasChocolate}
                title="Chocolate Blanco"
                className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                  hasChocolate
                    ? 'bg-stone-100 border-stone-300 opacity-40 shadow-inner'
                    : 'bg-white hover:bg-stone-50 border-stone-300 shadow-md hover:scale-110 cursor-pointer ring-2 ring-stone-200/50'
                }`}
              >
                🍫
              </button>

              <button
                onClick={handleAddButter}
                disabled={hasButter}
                title="Mantequilla Blanca"
                className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                  hasButter
                    ? 'bg-stone-100 border-stone-300 opacity-40 shadow-inner'
                    : 'bg-white hover:bg-stone-50 border-stone-300 shadow-md hover:scale-110 cursor-pointer ring-2 ring-stone-200/50'
                }`}
              >
                🧈
              </button>
            </div>
          </div>
        )}

        {/* Decreasing Bar & Countdown Container */}
        {bothInPot && (
          <div className="w-full max-w-md mb-4 bg-stone-900 text-white p-4 rounded-2xl border-2 border-stone-700 shadow-lg flex flex-col gap-3">
            {/* Header with status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  isFireActive
                    ? !isBarTransparent
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-400/40 animate-pulse'
                    : 'bg-stone-800 text-stone-400'
                }`}>
                  {!isBarTransparent || isStopped ? <Clock className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>

                <span className="text-xs font-bold text-stone-300">
                  {isStopped
                    ? 'Barra Detenida'
                    : isFireActive
                    ? !isBarTransparent
                      ? `Disminuyendo... (${totalDuration}s totales)`
                      : '¡Barra Transparente! Sigue disminuyendo...'
                    : `Barra Lista: ${totalDuration}s`}
                </span>
              </div>

              {/* Time display or mystery */}
              <div className="text-right">
                {isStopped ? (
                  <span className={`text-base font-black font-mono ${
                    Math.abs(stoppedAtDiff ?? 0) <= 0.4
                      ? 'text-emerald-400'
                      : Math.abs(stoppedAtDiff ?? 0) <= 1.0
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {stoppedAtDiff! >= 0 ? `+${stoppedAtDiff!.toFixed(2)}s` : `${stoppedAtDiff!.toFixed(2)}s`}
                  </span>
                ) : isFireActive ? (
                  !isBarTransparent ? (
                    <span className="text-base font-black font-mono text-amber-300">
                      {Math.max(0, timeRemaining).toFixed(1)}s
                    </span>
                  ) : (
                    <span className="text-sm font-black font-mono text-purple-300 tracking-wider animate-pulse">
                      [ ??? s ]
                    </span>
                  )
                ) : (
                  <span className="text-xs font-bold font-mono text-stone-400">
                    {totalDuration.toFixed(1)}s
                  </span>
                )}
              </div>
            </div>

            {/* THE DECREASING BAR (Becomes transparent at halfway, moves with 0 CSS lag) */}
            <div className="relative w-full h-6 bg-stone-800/90 rounded-full overflow-hidden p-0.5 border-2 border-stone-700 shadow-inner">
              {/* Inner decreasing fill */}
              <div
                className={`h-full rounded-full ${
                  isBarTransparent ? 'opacity-0' : 'opacity-100'
                } ${
                  isStopped
                    ? Math.abs(stoppedAtDiff ?? 0) <= 0.4
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                      : (stoppedAtDiff ?? 0) > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                      : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                }`}
                style={{
                  width: `${clampedPercent}%`,
                  transition: isStopped ? 'opacity 0.2s ease-in' : 'none',
                }}
              />

              {/* 50% halfway marker indicator line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-stone-500/80 z-10"
                style={{ left: '50%' }}
                title="Punto medio (50%): aquí la barra se vuelve transparente"
              />
            </div>

            {/* Helper scale labels */}
            <div className="flex justify-between text-[10px] text-stone-400 px-1 font-mono">
              <span>0s (Fin)</span>
              <span>50% (Transparente)</span>
              <span>{totalDuration}s (Inicio)</span>
            </div>
          </div>
        )}

        {/* The Pot Visual */}
        <div className="relative w-72 h-64 flex flex-col items-center justify-center my-2">
          {/* Stove Base */}
          <div className="absolute bottom-4 w-64 h-12 bg-stone-700 rounded-2xl shadow-lg border-2 border-stone-800 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {isFireActive && (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-6 h-6 animate-flame text-amber-400 fill-amber-400" />
                  <Flame className="w-8 h-8 animate-flame text-orange-500 fill-orange-400" />
                  <Flame className="w-6 h-6 animate-flame text-amber-400 fill-amber-400" />
                </div>
              )}
              {!isFireActive && (
                <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">
                  Brasas Dormidas
                </span>
              )}
            </div>
          </div>

          {/* Copper Pot */}
          <div className="relative z-10 w-56 h-36 rounded-b-[70px] bg-gradient-to-b from-amber-700 via-orange-900 to-amber-950 border-4 border-amber-600/80 shadow-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute -left-4 top-4 w-6 h-10 border-4 border-amber-600 rounded-l-full"></div>
            <div className="absolute -right-4 top-4 w-6 h-10 border-4 border-amber-600 rounded-r-full"></div>

            {/* Interior with WHITE chocolate and WHITE butter */}
            <div
              className="w-48 h-28 rounded-b-[60px] flex items-center justify-center transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: isStopped
                  ? Math.abs(stoppedAtDiff ?? 0) <= 0.4
                    ? '#fef3c7'
                    : (stoppedAtDiff ?? 0) < -1.5
                    ? '#78350f'
                    : '#fef9c3'
                  : isFireActive
                  ? '#fefce8'
                  : bothInPot
                  ? '#ffffff'
                  : '#2d1a10',
              }}
            >
              {/* White Butter block */}
              {hasButter && (!isStopped || (stoppedAtDiff ?? 0) > 1.5) && (
                <div
                  className="absolute bg-white border-2 border-stone-200 rounded-md shadow-md flex items-center justify-center text-xs font-bold text-stone-700"
                  style={{
                    width: `${Math.max(16, 46 * (1 - meltVisualPercent / 100))}px`,
                    height: `${Math.max(12, 32 * (1 - meltVisualPercent / 100))}px`,
                    top: '25%',
                    left: '32%',
                    opacity: 1 - meltVisualPercent / 110,
                  }}
                >
                  {meltVisualPercent < 50 && '🧈'}
                </div>
              )}

              {/* White Chocolate chunk */}
              {hasChocolate && (!isStopped || (stoppedAtDiff ?? 0) > 1.5) && (
                <div
                  className="absolute flex gap-1 items-center justify-center"
                  style={{
                    opacity: 1 - meltVisualPercent / 110,
                    top: '35%',
                    right: '25%',
                  }}
                >
                  <div className="w-10 h-10 bg-white rounded-lg border-2 border-stone-200 shadow-md flex items-center justify-center text-sm font-bold text-stone-700">
                    🍫
                  </div>
                </div>
              )}

              {/* Liquid Silky Pool when melting */}
              {meltVisualPercent > 20 && (
                <div className="w-36 h-20 rounded-full border border-amber-300/40 bg-amber-100/50 flex items-center justify-center">
                  <div className="w-24 h-12 rounded-full border border-amber-400/30"></div>
                </div>
              )}

              {/* Perfect finish sparkles */}
              {isStopped && Math.abs(stoppedAtDiff ?? 0) <= 0.4 && (
                <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-12 h-12 animate-pulse drop-shadow-md" />
                </div>
              )}

              {!hasChocolate && !hasButter && (
                <span className="text-stone-400 text-xs italic">Cazuela vacía</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-3">
          {/* Phase 1: Fire not started */}
          {!isFireActive && !isStopped && (
            <button
              onClick={handleStartFire}
              disabled={!bothInPot}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
                bothInPot
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white cursor-pointer hover:from-amber-500 shadow-amber-600/30 hover:scale-102'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
              }`}
            >
              <Flame className="w-5 h-5" />
              {bothInPot ? `🔥 Prender Fuego y Activar Barra (${totalDuration}s)` : 'Añade el chocolate y la mantequilla blancos'}
            </button>
          )}

          {/* Phase 2: Fire active -> Press to Stop */}
          {isFireActive && (
            <button
              onClick={handleStopFire}
              className={`w-full py-5 px-6 rounded-2xl font-black text-lg text-white shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 animate-pulse ${
                !isBarTransparent
                  ? 'bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 hover:from-orange-500'
                  : 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-800 hover:from-purple-600 ring-4 ring-purple-300/50'
              }`}
            >
              <span>🛑</span>
              <span>¡PULSAR AHORA! (Detener la Barra en 0s)</span>
            </button>
          )}

          {/* Phase 3: Stopped -> Review & Continue */}
          {isStopped && (
            <div className="flex flex-col gap-3">
              <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
                Math.abs(stoppedAtDiff ?? 0) <= 0.4
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : Math.abs(stoppedAtDiff ?? 0) <= 1.0
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="text-2xl">
                  {Math.abs(stoppedAtDiff ?? 0) <= 0.4 ? '👑' : Math.abs(stoppedAtDiff ?? 0) <= 1.0 ? '⭐' : '⚠️'}
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-sm">
                    {Math.abs(stoppedAtDiff ?? 0) <= 0.4
                      ? '¡Intuición Perfecta de Hestia!'
                      : (stoppedAtDiff ?? 0) > 0
                      ? 'Detuviste la barra antes de 0'
                      : 'Detuviste la barra después de 0'}
                  </span>
                  <span>
                    Diferencia: {stoppedAtDiff! >= 0 ? `+${stoppedAtDiff!.toFixed(2)}s antes` : `${Math.abs(stoppedAtDiff!).toFixed(2)}s después`}.
                    {Math.abs(stoppedAtDiff ?? 0) <= 0.35
                      ? ' Máxima puntuación conseguida (+8 pts de precisión).'
                      : Math.abs(stoppedAtDiff ?? 0) <= 0.8
                      ? ' Gran resultado (+6 pts de precisión).'
                      : ' Puntuación reducida según el desfase.'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinishStep}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                Continuar al Paso 2 (Mezclar)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
