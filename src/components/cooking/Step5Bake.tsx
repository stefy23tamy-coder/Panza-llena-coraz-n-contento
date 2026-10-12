import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, Sparkles, CheckCircle, BellRing, Award, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { StepScoreDetail } from '../../types/game';
import { sound } from '../../utils/sound';
import { BrownieShowcase } from '../BrownieShowcase';

interface Props {
  onComplete: (scoreDetail: StepScoreDetail) => void;
}

export const Step5Bake: React.FC<Props> = ({ onComplete }) => {
  // Phase progression: 'menu' -> 'temp-game' / 'time-game' -> 'baking' -> 'done'
  const [phase, setPhase] = useState<'menu' | 'temp-game' | 'time-game' | 'baking' | 'done'>('menu');

  // ==========================================
  // MINIJUEGO 1: TEMPERATURA OSCILANTE (175°C)
  // ==========================================
  const [tempOscillating, setTempOscillating] = useState<number>(175);
  const [tempStopped, setTempStopped] = useState<boolean>(false);
  const [tempCalibrated, setTempCalibrated] = useState<boolean>(false);
  const [finalTemp, setFinalTemp] = useState<number>(175);
  const [tempScore, setTempScore] = useState<number>(0);

  // Animation frame for oscillating temperature (Continuous, ultra-fluid 60fps subpixel motion)
  useEffect(() => {
    if (phase !== 'temp-game' || tempStopped) return;

    let animId: number;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // Oscillates smoothly between ~143°C and ~207°C with continuous floating point precision
      const current = 175 + 32 * Math.sin(elapsed * 2.6);
      setTempOscillating(current);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, tempStopped]);

  const handleStartPreheat = () => {
    sound.playClick();
    setTempStopped(false);
    setPhase('temp-game');
  };

  const handleStopTemperature = () => {
    if (tempStopped) return;
    sound.playClick();
    setTempStopped(true);
    setTempCalibrated(true);
    const roundedTemp = Math.round(tempOscillating);
    setFinalTemp(roundedTemp);

    const diff = Math.abs(roundedTemp - 175);
    let pts = 1;
    if (diff <= 2) {
      pts = 6;
      sound.playMagicBlessing();
    } else if (diff <= 6) {
      pts = 4;
      sound.playClick();
    } else if (diff <= 12) {
      pts = 3;
    } else {
      pts = 1;
      sound.playSizzle();
    }
    setTempScore(pts);
  };

  // ========================================================
  // MINIJUEGO 2: TIEMPO EN RANGO (20 a 25 min) CON IZQ / DER
  // ========================================================
  const [timeValue, setTimeValue] = useState<number>(15.0); // starts outside range so player must actively move it
  const [timeSecondsRemaining, setTimeSecondsRemaining] = useState<number>(8.0); // 8s game
  const [timeInRangeSeconds, setTimeInRangeSeconds] = useState<number>(0);
  const [timeGameActive, setTimeGameActive] = useState<boolean>(false);
  const [timeGameFinished, setTimeGameFinished] = useState<boolean>(false);
  const [timeScore, setTimeScore] = useState<number>(0);

  const isLeftPressedRef = useRef<boolean>(false);
  const isRightPressedRef = useRef<boolean>(false);
  const timeVelRef = useRef<number>(0);
  const [isLeftActive, setIsLeftActive] = useState<boolean>(false);
  const [isRightActive, setIsRightActive] = useState<boolean>(false);

  // Start Time Game
  const handleOpenTimeSetup = () => {
    sound.playClick();
    setTimeGameActive(false);
    setTimeSecondsRemaining(8.0);
    setTimeInRangeSeconds(0);
    setTimeValue(15.0);
    timeVelRef.current = 0;
    setPhase('time-game');
  };

  const handleStartTimeGame = () => {
    sound.playClick();
    setTimeGameActive(true);
    setTimeSecondsRemaining(8.0);
    setTimeInRangeSeconds(0);
    setTimeValue(15.0);
    timeVelRef.current = 0;
  };

  // Keyboard controls for Time Game (ArrowLeft / ArrowRight or A / D)
  useEffect(() => {
    if (phase !== 'time-game' || !timeGameActive || timeGameFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        isLeftPressedRef.current = true;
        setIsLeftActive(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        isRightPressedRef.current = true;
        setIsRightActive(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        isLeftPressedRef.current = false;
        setIsLeftActive(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        isRightPressedRef.current = false;
        setIsRightActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, timeGameActive, timeGameFinished]);

  // Game loop for Time Game (8s total) - Dynamic, active movement!
  useEffect(() => {
    if (phase !== 'time-game' || !timeGameActive || timeGameFinished) return;

    let animId: number;
    let lastTime = performance.now();
    let accumulatedInRange = 0;
    let currentVal = timeValue;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Active, multi-frequency natural drift wave (makes needle move significantly)
      const wave1 = Math.sin(now / 320) * 8.5;
      const wave2 = Math.cos(now / 580) * 6.0;
      const naturalDrift = wave1 + wave2;

      // Responsive, punchy player input
      let playerInput = 0;
      if (isLeftPressedRef.current) playerInput -= 17.5;
      if (isRightPressedRef.current) playerInput += 17.5;

      // Smooth inertia physics
      const targetVel = naturalDrift + playerInput;
      timeVelRef.current += (targetVel - timeVelRef.current) * 0.35;

      currentVal += timeVelRef.current * dt;
      // Clamp between 10.0 and 35.0
      currentVal = Math.max(10.0, Math.min(35.0, currentVal));
      setTimeValue(currentVal);

      // Check if inside optimal range: 20 to 25 minutes
      if (currentVal >= 20.0 && currentVal <= 25.0) {
        accumulatedInRange += dt;
        setTimeInRangeSeconds(accumulatedInRange);
      }

      setTimeSecondsRemaining((prev) => {
        const next = prev - dt;
        if (next <= 0) {
          cancelAnimationFrame(animId);
          // Finish Time Game
          sound.playMagicBlessing();
          setTimeGameActive(false);
          setTimeGameFinished(true);

          let pts = 1;
          if (accumulatedInRange >= 4.8) {
            pts = 6;
          } else if (accumulatedInRange >= 3.6) {
            pts = 4;
          } else if (accumulatedInRange >= 2.2) {
            pts = 3;
          } else {
            pts = 1;
          }
          setTimeScore(pts);
          return 0;
        }
        return next;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, timeGameActive, timeGameFinished]);

  // Touch handlers for buttons
  const pressLeft = () => {
    isLeftPressedRef.current = true;
    setIsLeftActive(true);
    sound.playClick();
  };
  const releaseLeft = () => {
    isLeftPressedRef.current = false;
    setIsLeftActive(false);
  };

  const pressRight = () => {
    isRightPressedRef.current = true;
    setIsRightActive(true);
    sound.playClick();
  };
  const releaseRight = () => {
    isRightPressedRef.current = false;
    setIsRightActive(false);
  };

  // ==========================================
  // BAKING IN THE OVEN PROGRESSION
  // ==========================================
  const [bakingProgress, setBakingProgress] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'baking' && bakingProgress < 100) {
      timer = setTimeout(() => {
        setBakingProgress((prev) => {
          const next = prev + 15;
          if (next >= 100) {
            sound.playOvenBell();
            setPhase('done');
            return 100;
          }
          return next;
        });
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [phase, bakingProgress]);

  // Finish Step 5 & Send Scores
  const handleFinishStep = () => {
    sound.playClick();

    const correctActions: string[] = [];
    const incorrectActions: string[] = [];

    // Minigame 1 Evaluation (Max 6 pts)
    if (tempScore === 6) {
      correctActions.push(`¡Fijación Perfecta! Detuviste la temperatura exactamente en ${finalTemp} °C (+6 pts)`);
    } else if (tempScore === 4) {
      correctActions.push(`Muy buena precisión térmica: fijaste a ${finalTemp} °C (a pocos grados de 175°C, +4 pts)`);
    } else if (tempScore === 3) {
      correctActions.push(`Temperatura aceptable fijada en ${finalTemp} °C (+3 pts)`);
    } else {
      incorrectActions.push(`Fijaste la temperatura alejada de 175 °C (${finalTemp} °C, +1 pt)`);
    }

    // Minigame 2 Evaluation (Max 6 pts)
    if (timeScore === 6) {
      correctActions.push(`¡Control Magistral de Tiempo! Mantuviste el temporizador ${timeInRangeSeconds.toFixed(1)}s en el rango 20–25 min (+6 pts)`);
    } else if (timeScore === 4) {
      correctActions.push(`Buen control: ${timeInRangeSeconds.toFixed(1)}s dentro del rango 20–25 min (+4 pts)`);
    } else if (timeScore === 3) {
      correctActions.push(`Control parcial del tiempo: ${timeInRangeSeconds.toFixed(1)}s en rango (+3 pts)`);
    } else {
      incorrectActions.push(`Dificultad manteniendo el rango 20–25 min: solo ${timeInRangeSeconds.toFixed(1)}s (+1 pt)`);
    }

    const totalStepScore = Math.max(1, Math.min(12, tempScore + timeScore));

    onComplete({
      stepIndex: 4,
      stepName: 'Paso 5: Calibración y Horneado Sagrado (Dos Minijuegos)',
      score: totalStepScore,
      maxScore: 12,
      correctActions,
      incorrectActions,
    });
  };

  // Helper values
  const isTimeCurrentlyInRange = timeValue >= 20.0 && timeValue <= 25.0;
  const tempPercent = Math.max(0, Math.min(100, ((tempOscillating - 140) / 70) * 100));
  const timePercent = Math.max(0, Math.min(100, ((timeValue - 10) / 25) * 100));

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* Banner */}
      <div className="w-full bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 shadow-sm mb-6 text-stone-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full font-mythic">
            Paso 5 de 5 • Máx. 12 Puntos
          </span>
          <span className="text-xs font-medium text-amber-800 flex items-center gap-1 font-mythic">
            <Sparkles className="w-3.5 h-3.5" /> El Horno Sagrado
          </span>
        </div>
        <h3 className="text-xl font-bold font-mythic text-amber-950">
          Paso 5 — Hornear (Dos Minijuegos)
        </h3>
        <p className="text-sm text-stone-700 mt-1">
          Antes de introducir la masa al horno, calibra con precisión los dos factores: <strong>«Precalentar horno»</strong> (a 175 °C) y <strong>«Ajustar tiempo»</strong> (20–25 min).
        </p>
      </div>

      {/* Main Container */}
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-amber-50 rounded-3xl border-4 border-amber-300 p-4 sm:p-6 shadow-xl flex flex-col items-center">

        {/* ======================================================== */}
        {/* PANTALLA INICIAL DE OPCIONES: PRECALENTAR / AJUSTAR TIEMPO */}
        {/* ======================================================== */}
        {phase === 'menu' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header info */}
            <div className="w-full bg-stone-900 text-white p-5 rounded-3xl border-2 border-amber-500/40 shadow-xl mb-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mythic flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Consola del Horno Sagrado
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold">
                  {(tempCalibrated ? 1 : 0) + (timeGameFinished ? 1 : 0)} / 2 Calibrados
                </span>
              </div>
              <h4 className="text-lg font-black font-mythic text-amber-100">
                Selecciona una Opción para Comenzar
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                El fuego de Hestia exige maestría. Antes de hornear la masa, debes calibrar los dos parámetros:
              </p>
            </div>

            {/* Options Cards */}
            <div className="w-full flex flex-col gap-3.5 mb-6">
              {/* Option 1: Precalentar horno */}
              <div
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  tempCalibrated
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-md'
                    : 'bg-white/95 border-amber-300 shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                        tempCalibrated ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      🔥
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-base text-stone-900 font-mythic">
                          Precalentar Horno
                        </h5>
                        {tempCalibrated && (
                          <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            ✓ Listo (+{tempScore} pts)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Fija la temperatura en <strong>175 °C</strong> deteniendo la barra oscilante (máx. 6 pts).
                      </p>
                    </div>
                  </div>
                  {tempCalibrated && (
                    <span className="text-sm font-black text-emerald-800 font-mono bg-emerald-100 px-2.5 py-1 rounded-xl shrink-0">
                      {finalTemp} °C
                    </span>
                  )}
                </div>

                <button
                  onClick={handleStartPreheat}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    tempCalibrated
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white ring-2 ring-orange-300'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>{tempCalibrated ? 'Volver a Precalentar Horno' : 'Precalentar horno'}</span>
                </button>
              </div>

              {/* Option 2: Ajustar tiempo */}
              <div
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  timeGameFinished
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-md'
                    : 'bg-white/95 border-amber-300 shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                        timeGameFinished ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-600'
                      }`}
                    >
                      ⏱️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-base text-stone-900 font-mythic">
                          Ajustar Tiempo
                        </h5>
                        {timeGameFinished && (
                          <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            ✓ Listo (+{timeScore} pts)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Mantén el tiempo en <strong>20 a 25 min</strong> con los botones de izquierda y derecha (máx. 6 pts).
                      </p>
                    </div>
                  </div>
                  {timeGameFinished && (
                    <span className="text-sm font-black text-emerald-800 font-mono bg-emerald-100 px-2.5 py-1 rounded-xl shrink-0">
                      {timeValue.toFixed(0)} min
                    </span>
                  )}
                </div>

                <button
                  onClick={handleOpenTimeSetup}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    timeGameFinished
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                      : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white ring-2 ring-sky-300'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{timeGameFinished ? 'Volver a Ajustar Tiempo' : 'Ajustar tiempo'}</span>
                </button>
              </div>
            </div>

            {/* Start Baking Action when both are calibrated */}
            {tempCalibrated && timeGameFinished ? (
              <button
                onClick={() => {
                  sound.playOvenBell();
                  setPhase('baking');
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 text-white font-black text-base shadow-2xl flex items-center justify-center gap-3 cursor-pointer animate-pulse transition-transform hover:scale-105"
              >
                <span>🔥</span>
                <span>¡INTRODUCIR BANDEJA Y HORNEAR! ({finalTemp} °C • {timeValue.toFixed(0)} min)</span>
                <Sparkles className="w-5 h-5 text-amber-200" />
              </button>
            ) : (
              <div className="w-full p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>
                  Calibra primero <strong>«Precalentar horno»</strong> y <strong>«Ajustar tiempo»</strong> para encender el fuego sagrado.
                </span>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MINIJUEGO 1: BARRA QUE SUBE Y BAJA CON LA TEMPERATURA    */}
        {/* ======================================================== */}
        {phase === 'temp-game' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header info */}
            <div className="w-full bg-stone-900 text-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-lg mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔥</span>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                    Precalentar Horno • Máx. 6 Pts
                  </span>
                  <span className="text-sm font-bold text-white">
                    {tempStopped ? '¡Temperatura Fijada!' : 'Detén la Barra en 175 °C'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-2xl font-black font-mono ${
                  Math.abs(tempOscillating - 175) <= 2
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {tempStopped ? `${finalTemp} °C` : `${tempOscillating.toFixed(0)} °C`}
                </span>
              </div>
            </div>

            {/* Dynamic Oscillating Bar Gauge */}
            <div className="w-full bg-white/95 p-5 rounded-3xl border-2 border-amber-200 shadow-md flex flex-col items-center mb-5">
              <div className="w-full flex justify-between items-center text-xs font-bold text-stone-500 mb-2">
                <span>140 °C (Bajo)</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  🎯 Objetivo: 175 °C
                </span>
                <span>210 °C (Alto)</span>
              </div>

              {/* Oscillating Bar Track */}
              <div className="relative w-full h-8 bg-stone-200 rounded-full p-1 border-2 border-stone-300 overflow-hidden flex items-center">
                {/* Target Sweet Spot (around 175°C) */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-300/60 border-x-2 border-emerald-500 z-0 flex items-center justify-center"
                  style={{
                    left: `${((172 - 140) / 70) * 100}%`,
                    width: `${((6) / 70) * 100}%`,
                  }}
                >
                  <span className="text-[9px] font-black text-emerald-900 tracking-tighter uppercase">
                    175°
                  </span>
                </div>

                {/* Oscillating Fluid Bar Fill (Direct 60fps subpixel) */}
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-full relative z-10"
                  style={{ width: `${tempPercent}%`, transition: 'none' }}
                />

                {/* Indicator Needle */}
                <div
                  className="absolute z-20 w-3.5 h-7 bg-stone-900 border-2 border-white rounded-full shadow-md"
                  style={{ left: `calc(${tempPercent}% - 7px)`, transition: 'none' }}
                />
              </div>

              <span className="text-xs text-stone-500 mt-3 text-center">
                La barra sube y baja constantemente. Pulsa el botón cuando la aguja cruce la zona verde de <strong>175 °C</strong>.
              </span>
            </div>

            {/* Stop Action Button or Next Game */}
            {!tempStopped ? (
              <button
                onClick={handleStopTemperature}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-lg shadow-xl cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span>🛑</span>
                <span>¡PULSAR PARA FIJAR EN 175 °C!</span>
              </button>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {tempScore === 6 ? '👑' : '✨'}
                    </span>
                    <div>
                      <span className="font-bold text-sm block">
                        Fijado en {finalTemp} °C ({tempScore === 6 ? '¡Exacto!' : `a ${Math.abs(finalTemp - 175)}°C`})
                      </span>
                      <span className="text-xs text-emerald-800">
                        Puntuación obtenida: +{tempScore} / 6 pts
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                    +{tempScore} pts
                  </span>
                </div>

                {!timeGameFinished ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      handleOpenTimeSetup();
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continuar al Minijuego: Ajustar Tiempo (20–25 min)</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playOvenBell();
                      setPhase('baking');
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>¡Ambos Calibrados! Proceder al Horneado</span>
                    <Flame className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    setPhase('menu');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a Opciones del Horno</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* MINIJUEGO 2: PULSAR DERECHA / IZQUIERDA PARA MANTENER TIEMPO EN RANGO  */}
        {/* ======================================================================= */}
        {phase === 'time-game' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header info */}
            <div className="w-full bg-stone-900 text-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-lg mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⏱️</span>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                    Ajustar Tiempo • Máx. 6 Pts
                  </span>
                  <span className="text-sm font-bold text-white">
                    {timeGameFinished
                      ? '¡Tiempo en Rango Calibrado!'
                      : 'Mantén el tiempo en 20–25 min'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                {timeGameActive ? (
                  <span className="text-lg font-black font-mono text-amber-400">
                    {timeSecondsRemaining.toFixed(1)}s
                  </span>
                ) : timeGameFinished ? (
                  <span className="text-xs font-bold text-emerald-400">
                    +{timeScore} / 6 Pts
                  </span>
                ) : (
                  <span className="text-xs font-bold text-stone-400">
                    8.0s de reto
                  </span>
                )}
              </div>
            </div>

            {/* Time Gauge with 20–25 min Green Zone */}
            <div className="w-full bg-white/95 p-5 rounded-3xl border-2 border-amber-200 shadow-md flex flex-col items-center mb-5">
              <div className="w-full flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-stone-500">10 min</span>
                <span className={`px-2.5 py-0.5 rounded-full border transition-colors ${
                  isTimeCurrentlyInRange
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 animate-pulse'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}>
                  {isTimeCurrentlyInRange ? '✨ ¡DENTRO DEL RANGO 20–25 min!' : '⚠️ Fuera de rango'}
                </span>
                <span className="text-stone-500">35 min</span>
              </div>

              {/* Track with Target Zone */}
              <div className="relative w-full h-10 bg-stone-200 rounded-2xl p-1 border-2 border-stone-300 overflow-hidden flex items-center">
                {/* 20 to 25 min Green Target Zone */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-400/50 border-x-2 border-emerald-600 z-0 flex items-center justify-center"
                  style={{
                    left: `${((20 - 10) / 25) * 100}%`,
                    width: `${((5) / 25) * 100}%`,
                  }}
                >
                  <span className="text-[10px] font-black text-emerald-950 uppercase">
                    20 – 25 min
                  </span>
                </div>

                {/* Moving Pointer Ball */}
                <div
                  className={`absolute z-20 w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-xs font-black ${
                    isTimeCurrentlyInRange
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/60'
                      : 'bg-orange-600 text-white'
                  }`}
                  style={{
                    left: `calc(${timePercent}% - 16px)`,
                    transition: 'none',
                  }}
                >
                  ⏱
                </div>
              </div>

              {/* Current Value Display */}
              <div className="w-full flex justify-between items-center mt-3 text-xs">
                <span className="font-bold text-stone-600">
                  Tiempo actual: <strong className="text-stone-900 text-sm">{timeValue.toFixed(1)} min</strong>
                </span>
                <span className="font-bold text-emerald-700">
                  En zona óptima: <strong>{timeInRangeSeconds.toFixed(1)}s</strong>
                </span>
              </div>
            </div>

            {/* Game Controls: Start or Left/Right interactive buttons */}
            {!timeGameActive && !timeGameFinished && (
              <div className="w-full flex flex-col gap-2.5">
                <button
                  onClick={handleStartTimeGame}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Iniciar Minijuego de Tiempo (8 segundos)</span>
                  <Sparkles className="w-5 h-5 text-sky-200" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setPhase('menu');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a Opciones del Horno</span>
                </button>
              </div>
            )}

            {timeGameActive && (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onMouseDown={pressLeft}
                    onMouseUp={releaseLeft}
                    onTouchStart={pressLeft}
                    onTouchEnd={releaseLeft}
                    className={`py-5 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all select-none cursor-pointer ${
                      isLeftActive
                        ? 'bg-sky-600 text-white border-sky-400 scale-95 shadow-inner'
                        : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300 active:scale-95'
                    }`}
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span>◄ BAJAR TIEMPO</span>
                  </button>

                  <button
                    onMouseDown={pressRight}
                    onMouseUp={releaseRight}
                    onTouchStart={pressRight}
                    onTouchEnd={releaseRight}
                    className={`py-5 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all select-none cursor-pointer ${
                      isRightActive
                        ? 'bg-amber-600 text-white border-amber-400 scale-95 shadow-inner'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 active:scale-95'
                    }`}
                  >
                    <span>SUBIR TIEMPO ►</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>

                <span className="text-[11px] text-stone-500 text-center">
                  Pulsa a la izquierda para reducir y a la derecha para aumentar. (También puedes usar flechas ◄ ► o teclas A / D).
                </span>
              </div>
            )}

            {timeGameFinished && (
              <div className="w-full flex flex-col gap-3">
                <div className="w-full p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm block">
                      ¡Calibración de Tiempo Completada!
                    </span>
                    <span className="text-xs text-emerald-800">
                      Mantuviste {timeInRangeSeconds.toFixed(1)}s en rango (+{timeScore} / 6 pts).
                    </span>
                  </div>
                  <span className="text-sm font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                    +{timeScore} pts
                  </span>
                </div>

                {tempCalibrated ? (
                  <button
                    onClick={() => {
                      sound.playOvenBell();
                      setPhase('baking');
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>¡Ambos Calibrados! Proceder al Horneado</span>
                    <Flame className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      handleStartPreheat();
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continuar al Minijuego: Precalentar Horno (175 °C)</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    setPhase('menu');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a Opciones del Horno</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* BAKING ANIMATION IN THE STONE HEARTH                    */}
        {/* ======================================================== */}
        {phase === 'baking' && (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Stone Oven Visual */}
            <div className="relative w-80 h-60 bg-gradient-to-b from-stone-800 via-stone-700 to-stone-900 rounded-3xl border-4 border-amber-800 shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4 my-2">
              <div className="flex items-center gap-2 text-amber-300 font-mythic text-xs tracking-widest uppercase">
                <span>🔥</span> Horno Sagrado de Hestia <span>🔥</span>
              </div>

              <div className="relative w-64 h-32 rounded-2xl bg-stone-950 border-2 border-stone-600 shadow-inner overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent animate-pulse" />

                <div className="relative w-48 h-24 rounded-xl bg-amber-950 border-2 border-amber-700 shadow-lg flex items-center justify-center overflow-hidden">
                  <div className="w-44 h-20 rounded-lg relative flex items-center justify-center bg-[#3b1a0d]">
                    <div className="text-amber-300 text-xs font-semibold animate-pulse">
                      Horneando a {finalTemp}°C ({timeValue.toFixed(0)} min)...
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-xs px-2 text-stone-300">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {finalTemp} °C (+{tempScore} pts)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {timeValue.toFixed(0)} min (+{timeScore} pts)
                </span>
              </div>
            </div>

            {/* Baking Progress Bar */}
            <div className="w-full mt-4 bg-white/90 p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Cocinando con el Fuego Sagrado...
              </div>
              <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 rounded-full transition-all"
                  style={{ width: `${bakingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EL BROWNIE AL FINAL: VISUAL COMPLETO RECIÉN HORNEADO     */}
        {/* ======================================================== */}
        {phase === 'done' && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Success notification */}
            <div className="w-full max-w-md bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-950 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-200 flex items-center justify-center text-xl">
                  <BellRing className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="font-bold text-sm font-mythic">
                    ¡Ding! Brownies Recién Salidos del Horno
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Precalentado ({finalTemp}°C, +{tempScore} pts) y Tiempo ({timeValue.toFixed(0)} min, +{timeScore} pts) = <strong>+{tempScore + timeScore} / 12 pts</strong>
                  </p>
                </div>
              </div>
              <span className="text-base font-black bg-emerald-200 text-emerald-950 px-3 py-1 rounded-full">
                +{tempScore + timeScore} pts
              </span>
            </div>

            {/* THE VISUAL OF THE FINISHED BROWNIE */}
            <BrownieShowcase
              score={Math.max(1, Math.min(60, (tempScore + timeScore) * 5))}
              tierName="Recién Salido del Horno Sagrado"
            />

            {/* Final verdict trigger button */}
            <div className="w-full max-w-md mt-2">
              <button
                onClick={handleFinishStep}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <Award className="w-5 h-5" />
                Ver Calidad del Brownie y Veredicto de Hestia (1 a 60 Pts)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
