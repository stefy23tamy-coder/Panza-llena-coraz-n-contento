import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Sparkles, Scale, AlertTriangle, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { StepScoreDetail } from '../../types/game';
import { sound } from '../../utils/sound';

interface Props {
  onComplete: (scoreDetail: StepScoreDetail) => void;
}

const BALANCE_DURATION_SECONDS = 10.0;
const GREEN_ZONE_HALF_WIDTH = 22; // Compact focused green zone (44px wide total)
const MAX_BALL_X = 118; // Half length of beam minus ball radius

export const Step2Mix: React.FC<Props> = ({ onComplete }) => {
  // Ingredients in bowl
  const [egg1Cracked, setEgg1Cracked] = useState<boolean>(false);
  const [egg2Cracked, setEgg2Cracked] = useState<boolean>(false);
  const [sugarAdded, setSugarAdded] = useState<boolean>(false);

  // Balance & Whisking states (10s mini-game, 6s in green zone for max score)
  const [isBalancing, setIsBalancing] = useState<boolean>(false);
  const [balanceTimeRemaining, setBalanceTimeRemaining] = useState<number>(BALANCE_DURATION_SECONDS);
  const [beamAngle, setBeamAngle] = useState<number>(0); // In degrees (-18 to +18)
  const [ballX, setBallX] = useState<number>(0); // In px (-MAX_BALL_X to +MAX_BALL_X)
  const [greenTimeAccumulated, setGreenTimeAccumulated] = useState<number>(0);
  const [balanceFinished, setBalanceFinished] = useState<boolean>(false);
  const [finalGreenSeconds, setFinalGreenSeconds] = useState<number>(0);

  // Active inputs
  const [isPressingLeft, setIsPressingLeft] = useState<boolean>(false);
  const [isPressingRight, setIsPressingRight] = useState<boolean>(false);

  // Chocolate integration phase
  const [chocolatePoured, setChocolatePoured] = useState<number>(0);

  // Physics refs
  const beamAngleRef = useRef<number>(0);
  const ballXRef = useRef<number>(0);
  const ballVelRef = useRef<number>(0);
  const greenTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const inputLeftRef = useRef<boolean>(false);
  const inputRightRef = useRef<boolean>(false);

  const allIngredientsInBowl = egg1Cracked && egg2Cracked && sugarAdded;
  const isChocolateIntegrated = chocolatePoured >= 100;
  const isBallInGreenZone = Math.abs(ballX) <= GREEN_ZONE_HALF_WIDTH;

  // Add ingredients
  const handleCrackEgg1 = () => {
    if (egg1Cracked) return;
    sound.playClick();
    setEgg1Cracked(true);
  };

  const handleCrackEgg2 = () => {
    if (egg2Cracked) return;
    sound.playClick();
    setEgg2Cracked(true);
  };

  const handleAddSugar = () => {
    if (sugarAdded) return;
    sound.playClick();
    setSugarAdded(true);
  };

  // Start the 10-second balance mini-game
  const handleStartBalance = () => {
    if (!allIngredientsInBowl || isBalancing || balanceFinished) return;
    sound.playClick();
    sound.playWhisk();
    setIsBalancing(true);

    beamAngleRef.current = 0;
    ballXRef.current = 0;
    ballVelRef.current = 0;
    greenTimeRef.current = 0;
    startTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!startTimeRef.current || !lastTimeRef.current) return;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, BALANCE_DURATION_SECONDS - elapsed);
      setBalanceTimeRemaining(remaining);

      // Smooth natural sway ("se carga a un lado y al otro")
      // Gentle, smooth waves for easy playability
      const naturalSway = Math.sin(elapsed * 1.1) * 5.5 + Math.sin(elapsed * 0.55) * 2.2;

      // Player inputs apply smooth, manageable counter-tilt
      let playerTilt = 0;
      if (inputLeftRef.current) playerTilt -= 9.5;
      if (inputRightRef.current) playerTilt += 9.5;

      const targetAngle = naturalSway + playerTilt;

      // Smooth interpolation of beam angle (fluid and gentle)
      beamAngleRef.current += (targetAngle - beamAngleRef.current) * 0.08;
      setBeamAngle(beamAngleRef.current);

      // Smooth ball acceleration along incline (gentle rolling)
      const ballAcc = beamAngleRef.current * 0.06;
      ballVelRef.current = (ballVelRef.current + ballAcc) * 0.90; // viscous damping for smooth control
      ballXRef.current += ballVelRef.current;

      // Soft stop if hitting beam edges
      if (ballXRef.current > MAX_BALL_X) {
        ballXRef.current = MAX_BALL_X;
        ballVelRef.current = 0;
      } else if (ballXRef.current < -MAX_BALL_X) {
        ballXRef.current = -MAX_BALL_X;
        ballVelRef.current = 0;
      }
      setBallX(ballXRef.current);

      // Check if ball is inside the green zone
      if (Math.abs(ballXRef.current) <= GREEN_ZONE_HALF_WIDTH) {
        greenTimeRef.current += dt;
        setGreenTimeAccumulated(greenTimeRef.current);
      }

      if (remaining > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        finishBalanceMiniGame();
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  const finishBalanceMiniGame = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sound.playMagicBlessing();
    setIsBalancing(false);
    setBalanceFinished(true);

    const seconds = Math.min(10, Math.round(greenTimeRef.current * 10) / 10);
    setFinalGreenSeconds(seconds);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isBalancing) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputLeftRef.current = true;
        setIsPressingLeft(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRightRef.current = true;
        setIsPressingRight(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputLeftRef.current = false;
        setIsPressingLeft(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRightRef.current = false;
        setIsPressingRight(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isBalancing]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Touch / Mouse control helpers
  const startLeft = () => {
    inputLeftRef.current = true;
    setIsPressingLeft(true);
    sound.playClick();
  };
  const stopLeft = () => {
    inputLeftRef.current = false;
    setIsPressingLeft(false);
  };

  const startRight = () => {
    inputRightRef.current = true;
    setIsPressingRight(true);
    sound.playClick();
  };
  const stopRight = () => {
    inputRightRef.current = false;
    setIsPressingRight(false);
  };

  // Chocolate integration handlers
  const handlePourGradual = () => {
    if (!balanceFinished || isChocolateIntegrated) return;
    sound.playWhisk();
    setChocolatePoured((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        sound.playMagicBlessing();
        return 100;
      }
      return next;
    });
  };

  // Step completion calculation
  const handleFinishStep = () => {
    sound.playClick();

    const correctActions: string[] = [];
    const incorrectActions: string[] = [];
    let score = 0;

    // Added 2 eggs + sugar (required prep, 0 pts)
    if (egg1Cracked && egg2Cracked && sugarAdded) {
      correctActions.push('Uniste los 2 huevos y el azúcar en el cuenco');
    }

    // Ball in green zone evaluation: 6.0s gives maximum +12 pts (exclusively from the minigame)
    if (finalGreenSeconds >= 6.0) {
      score = 12;
      correctActions.push(`¡Puntaje Máximo en el Juego de la Balanza! Mantuviste la pelota ${finalGreenSeconds.toFixed(1)}s en la zona verde (alcanzaste los 6.0s requeridos, +12 pts)`);
    } else if (finalGreenSeconds >= 5.0) {
      score = 10;
      correctActions.push(`Gran equilibrio en el juego de la balanza: ${finalGreenSeconds.toFixed(1)}s en la zona verde (+10 pts)`);
    } else if (finalGreenSeconds >= 4.0) {
      score = 7;
      correctActions.push(`Buen control en la balanza: ${finalGreenSeconds.toFixed(1)}s en la zona verde (+7 pts)`);
    } else if (finalGreenSeconds >= 2.5) {
      score = 4;
      correctActions.push(`Equilibrio parcial: lograste ${finalGreenSeconds.toFixed(1)}s en la zona verde (+4 pts)`);
    } else {
      score = 2;
      incorrectActions.push(`Poco tiempo en la zona verde: solo ${finalGreenSeconds.toFixed(1)}s de los 6.0s requeridos (+2 pts)`);
    }

    // Chocolate incorporation (secondary step, 0 pts)
    if (isChocolateIntegrated) {
      correctActions.push('Incorporaste el chocolate derretido poco a poco en hilo suave');
    }

    onComplete({
      stepIndex: 1,
      stepName: 'Paso 2: Mezclar Huevos, Azúcar y Chocolate',
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Paso 2 de 5 • Máx. 12 Puntos
          </span>
          <span className="text-xs font-medium text-stone-500 font-mythic">
            Batido con Balanza (10s)
          </span>
        </div>
        <h3 className="text-xl font-bold font-mythic text-amber-950">
          Paso 2 — Mezclar
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          Añade los <strong className="text-stone-900">2 huevos</strong> y el <strong className="text-stone-900">azúcar</strong>. Al batir, la balanza se cargará hacia los lados: <span className="font-semibold text-amber-950 underline decoration-emerald-500">mantén la pelota al menos 6 segundos en la zona verde</span> (de 10s totales) para obtener el puntaje máximo. Luego incorpora el chocolate.
        </p>
      </div>

      {/* Main Mixing Station */}
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-amber-50 rounded-3xl border-4 border-amber-200 p-6 shadow-xl flex flex-col items-center">
        {/* Ingredients to Add Rack (Only emojis) */}
        {!allIngredientsInBowl && (
          <div className="w-full mb-4 bg-white/90 p-4 rounded-2xl border-2 border-stone-200 shadow-md flex flex-col items-center">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-3">
              Ingredientes para el Cuenco:
            </span>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCrackEgg1}
                disabled={egg1Cracked}
                title="Huevo 1"
                className={`w-18 h-18 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                  egg1Cracked
                    ? 'bg-stone-100 border-stone-300 opacity-40 shadow-inner'
                    : 'bg-white hover:bg-stone-50 border-stone-300 hover:scale-110 shadow-md cursor-pointer'
                }`}
              >
                🥚
              </button>

              <button
                onClick={handleCrackEgg2}
                disabled={egg2Cracked}
                title="Huevo 2"
                className={`w-18 h-18 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                  egg2Cracked
                    ? 'bg-stone-100 border-stone-300 opacity-40 shadow-inner'
                    : 'bg-white hover:bg-stone-50 border-stone-300 hover:scale-110 shadow-md cursor-pointer'
                }`}
              >
                🥚
              </button>

              <button
                onClick={handleAddSugar}
                disabled={sugarAdded}
                title="Azúcar"
                className={`w-18 h-18 rounded-2xl border-2 flex items-center justify-center text-4xl transition-all ${
                  sugarAdded
                    ? 'bg-stone-100 border-stone-300 opacity-40 shadow-inner'
                    : 'bg-white hover:bg-stone-50 border-stone-300 hover:scale-110 shadow-md cursor-pointer'
                }`}
              >
                🍚
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FLUID BALANCE BEAM WITH BALL IN GREEN ZONE (10 Segundos) */}
        {/* ======================================================== */}
        {allIngredientsInBowl && (
          <div className="w-full max-w-md mb-4 bg-stone-900 text-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-xl flex flex-col gap-3">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isBalancing
                    ? isBallInGreenZone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 animate-pulse'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-400/50'
                    : balanceFinished
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-stone-800 text-stone-400'
                }`}>
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                    {balanceFinished ? 'Equilibrio Completado' : 'Balanza del Hogar'}
                  </span>
                  <span className="text-xs font-bold text-amber-200">
                    {balanceFinished
                      ? `¡${finalGreenSeconds.toFixed(1)}s en Zona Verde! (Objetivo: 6.0s)`
                      : isBalancing
                      ? greenTimeAccumulated >= 6.0
                        ? '★ ¡Objetivo Máximo de 6s Logrado!'
                        : isBallInGreenZone
                        ? `✨ En Zona Verde: ${greenTimeAccumulated.toFixed(1)}s / 6.0s`
                        : `⚠️ Fuera de zona: ${greenTimeAccumulated.toFixed(1)}s / 6.0s`
                      : 'Objetivo: 6.0s en Zona Verde (10s totales)'}
                  </span>
                </div>
              </div>

              {/* Time remaining / Score */}
              <div className="text-right">
                {isBalancing ? (
                  <span className="text-xl font-black font-mono text-amber-300">
                    {balanceTimeRemaining.toFixed(1)}s
                  </span>
                ) : balanceFinished ? (
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {finalGreenSeconds >= 6.0
                      ? '+12 Pts (Máx)'
                      : finalGreenSeconds >= 5.0
                      ? '+10 Pts'
                      : finalGreenSeconds >= 4.0
                      ? '+7 Pts'
                      : finalGreenSeconds >= 2.5
                      ? '+4 Pts'
                      : '+2 Pts'}
                  </span>
                ) : (
                  <span className="text-xs font-bold font-mono text-stone-400">
                    10.0s
                  </span>
                )}
              </div>
            </div>

            {/* Visual Balance Beam with Rolling Ball */}
            <div className="relative w-full h-36 bg-stone-950 rounded-xl border border-stone-800 flex flex-col items-center justify-between p-3 overflow-hidden select-none">
              {/* Status Header inside board */}
              <div className="w-full flex items-center justify-between px-2 text-[10px] text-stone-400 font-mono">
                <span>◄ Inclinar Izquierda</span>
                <span className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  isBallInGreenZone && isBalancing
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                    : 'bg-stone-800 text-stone-400'
                }`}>
                  Zona Verde Central
                </span>
                <span>Inclinar Derecha ►</span>
              </div>

              {/* Tilting Beam & Rolling Ball Assembly */}
              <div className="relative w-full h-16 flex items-center justify-center my-1">
                {/* Center fulcrum triangle */}
                <div className="absolute top-9 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-amber-500 z-0" />

                {/* Rotating Beam Container */}
                <div
                  className="relative w-72 h-8 rounded-full border-2 border-amber-600/80 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 shadow-lg flex items-center justify-center z-10"
                  style={{
                    transform: `rotate(${beamAngle}deg)`,
                    transition: 'none', // Handled smoothly frame-by-frame
                  }}
                >
                  {/* Central GREEN ZONE cradle (clean and compact without letters) */}
                  <div
                    className={`absolute h-7 rounded-lg border-2 transition-colors ${
                      isBallInGreenZone && isBalancing
                        ? 'bg-emerald-500/35 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                        : 'bg-emerald-950/40 border-emerald-600/60'
                    }`}
                    style={{ width: `${GREEN_ZONE_HALF_WIDTH * 2}px` }}
                  />

                  {/* Rolling Golden Marble / Pelota */}
                  <div
                    className={`absolute w-6 h-6 rounded-full border-2 z-20 flex items-center justify-center shadow-lg transition-transform ${
                      isBallInGreenZone && isBalancing
                        ? 'bg-gradient-to-tr from-amber-300 via-yellow-200 to-white border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)] scale-110'
                        : 'bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 border-amber-200 shadow-md'
                    }`}
                    style={{
                      transform: `translateX(${ballX}px)`,
                      transition: 'none',
                    }}
                  >
                    {isBallInGreenZone && isBalancing && (
                      <span className="text-[10px] animate-pulse">✨</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress counter of time in green zone */}
              <div className="w-full flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span className={isPressingLeft ? 'text-amber-400 font-bold' : ''}>
                  {isPressingLeft ? '◄ EMPUJANDO' : '◄ Izquierda'}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Zona Verde: {greenTimeAccumulated.toFixed(1)}s / 6.0s (Objetivo Máx)
                </span>
                <span className={isPressingRight ? 'text-amber-400 font-bold' : ''}>
                  {isPressingRight ? 'EMPUJANDO ►' : 'Derecha ►'}
                </span>
              </div>
            </div>

            {/* Left & Right Touch/Click Controls */}
            {isBalancing && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onMouseDown={startLeft}
                  onMouseUp={stopLeft}
                  onMouseLeave={stopLeft}
                  onTouchStart={startLeft}
                  onTouchEnd={stopLeft}
                  className={`py-4 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer select-none ${
                    isPressingLeft
                      ? 'bg-amber-500 text-stone-950 scale-98 ring-4 ring-amber-300'
                      : 'bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 text-white ring-2 ring-amber-400/40'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Inclinar a la Izquierda</span>
                </button>

                <button
                  onMouseDown={startRight}
                  onMouseUp={stopRight}
                  onMouseLeave={stopRight}
                  onTouchStart={startRight}
                  onTouchEnd={stopRight}
                  className={`py-4 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer select-none ${
                    isPressingRight
                      ? 'bg-amber-500 text-stone-950 scale-98 ring-4 ring-amber-300'
                      : 'bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-600 text-white ring-2 ring-amber-400/40'
                  }`}
                >
                  <span>Inclinar a la Derecha</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Start Button if not started */}
            {!isBalancing && !balanceFinished && (
              <button
                onClick={handleStartBalance}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Comenzar Batido: Mantener Pelota en Zona Verde (10s)</span>
              </button>
            )}
          </div>
        )}

        {/* The Ceramic Mixing Bowl Visual */}
        <div className="relative w-72 h-52 flex flex-col items-center justify-center my-1">
          <div className="relative w-64 h-44 rounded-b-[100px] bg-gradient-to-b from-stone-50 via-amber-100 to-amber-200 border-4 border-amber-300 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 w-full h-4 bg-amber-200/60 border-b border-amber-300"></div>

            <div
              className="w-56 h-32 rounded-b-[80px] flex items-center justify-center transition-all duration-500 relative overflow-hidden"
              style={{
                backgroundColor: isChocolateIntegrated
                  ? '#3b180a'
                  : chocolatePoured > 0
                  ? '#613214'
                  : allIngredientsInBowl
                  ? '#fef3c7'
                  : '#fafaf9',
              }}
            >
              {/* Egg Yolks before whisking */}
              {!balanceFinished && !isBalancing && allIngredientsInBowl && (
                <div className="flex gap-4 items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-amber-400 border-2 border-amber-500 shadow-inner flex items-center justify-center text-xs text-amber-900 font-bold">
                    ✦
                  </div>
                  <div className="w-9 h-9 rounded-full bg-amber-400 border-2 border-amber-500 shadow-inner flex items-center justify-center text-xs text-amber-900 font-bold">
                    ✦
                  </div>
                </div>
              )}

              {/* Foamy bubbles during balancing */}
              {(isBalancing || balanceFinished) && !isChocolateIntegrated && (
                <div className="absolute inset-0 flex flex-wrap gap-2 items-center justify-center p-3 opacity-85">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isBalancing ? { y: [-2, 2, -2], scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-6 h-6 rounded-full bg-amber-200/80 border border-amber-300/50"
                    />
                  ))}
                </div>
              )}

              {/* Integrated chocolate */}
              {isChocolateIntegrated && (
                <div className="flex flex-col items-center justify-center text-amber-300">
                  <Sparkles className="w-7 h-7 animate-pulse mb-1" />
                  <span className="text-xs font-bold text-amber-200 tracking-wide">
                    Chocolate Integrado
                  </span>
                </div>
              )}
            </div>

            {/* Whisk tool animated during balancing */}
            {isBalancing && (
              <motion.div
                animate={{
                  rotate: [-20, 20, -20],
                  y: [-4, 4, -4],
                }}
                transition={{ duration: 0.25, repeat: Infinity }}
                className="absolute z-20 top-1 right-12 w-5 h-26 bg-gradient-to-b from-stone-400 to-amber-600 rounded-b-xl border border-stone-500 shadow-md origin-top"
              />
            )}
          </div>
        </div>

        {/* Phase 3: Chocolate Incorporation (After Balance is done) */}
        {balanceFinished && !isChocolateIntegrated && (
          <div className="w-full max-w-md mt-4 bg-white/90 p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                Incorporar Chocolate Derretido:
              </span>
              <span className="text-xs font-bold text-amber-900">
                {chocolatePoured}% añadido
              </span>
            </div>

            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-stone-900 rounded-full transition-all"
                style={{ width: `${chocolatePoured}%` }}
              />
            </div>

            <div className="w-full pt-1">
              <button
                onClick={handlePourGradual}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <span>🍫</span> Incorporar chocolate poco a poco en hilo (+25%)
              </button>
            </div>
          </div>
        )}

        {/* Completion button */}
        {isChocolateIntegrated && (
          <div className="w-full max-w-md mt-6">
            <button
              onClick={handleFinishStep}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5" />
              Completar Paso 2 e Ir al Paso 3
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
