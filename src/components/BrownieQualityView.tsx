import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, RotateCcw, BookOpen, Sparkles, Star, Flame, Trophy } from 'lucide-react';
import { StepScoreDetail } from '../types/game';
import { getQualityTier } from '../data/recipeData';
import { sound } from '../utils/sound';
import { BrownieShowcase } from './BrownieShowcase';

interface Props {
  stepScores: StepScoreDetail[];
  onCookAgain: () => void;
  onOpenRecipeBook: () => void;
}

export const BrownieQualityView: React.FC<Props> = ({
  stepScores,
  onCookAgain,
  onOpenRecipeBook,
}) => {
  // Total score between 1 and 60
  const rawScore = stepScores.reduce((acc, step) => acc + step.score, 0);
  const totalScore = Math.max(1, Math.min(60, rawScore));
  const quality = getQualityTier(totalScore);

  React.useEffect(() => {
    if (totalScore >= 45) {
      sound.playBoneHealing();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#ffffff'],
      });
    } else {
      sound.playClick();
    }
  }, [totalScore]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Top Quality Badge Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${quality.colorClass} border-4 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          {/* Big Score Medallion */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-stone-950/80 border-4 border-amber-300 flex flex-col items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mythic">
                {totalScore}
              </span>
              <span className="text-[11px] font-bold text-amber-200/80 uppercase tracking-widest">
                de 60 Pts
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase shadow">
              {quality.badge}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < quality.stars
                      ? 'fill-amber-400 text-amber-400 drop-shadow'
                      : 'text-stone-400/40'
                  }`}
                />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mythic tracking-wide">
              {quality.tierName}
            </h2>
            <p className="text-sm sm:text-base font-bold opacity-90">
              {quality.title}
            </p>
            <p className="text-xs sm:text-sm opacity-80 max-w-md">
              {quality.description}
            </p>
          </div>
        </div>

        {/* Quick Restart Action */}
        <div className="z-10 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              sound.playMagicBlessing();
              onCookAgain();
            }}
            className="py-3 px-5 rounded-2xl bg-stone-950 text-amber-200 hover:bg-stone-900 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Cocinar Otra Tanda
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenRecipeBook();
            }}
            className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Consultar Receta
          </button>
        </div>
      </motion.div>

      {/* Visual Presentation of the Baked Brownie */}
      <BrownieShowcase score={totalScore} tierName={quality.tierName} />

      {/* Sensory & Curative Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Texture Card */}
        <div className="bg-white/90 rounded-2xl p-5 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
              <span>🍫</span> Análisis de Textura y Corteza
            </span>
            <p className="text-sm text-stone-700 leading-relaxed">
              {quality.textureEvaluation}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Craquelado exterior</span>
            <span className="text-amber-900 font-bold">
              {totalScore >= 50 ? 'Crujiente y fino' : totalScore >= 30 ? 'Parcial' : 'Opaco o quemado'}
            </span>
          </div>
        </div>

        {/* Curative Effect Card */}
        <div className="bg-white/90 rounded-2xl p-5 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Poder Curativo de Huesos Rotos
            </span>
            <p className="text-sm text-stone-700 leading-relaxed font-semibold text-stone-800">
              {quality.healingEffect}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Efectividad en fracturas</span>
            <span className={`font-bold ${totalScore >= 45 ? 'text-emerald-700' : 'text-stone-700'}`}>
              {totalScore >= 55 ? '100% Instantánea' : totalScore >= 45 ? '85% Rápida' : totalScore >= 30 ? '40% Leve' : 'Inerte'}
            </span>
          </div>
        </div>
      </div>

      {/* Goddess Hestia's Personal Verdict */}
      <div className="bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/80 rounded-2xl p-5 border-2 border-amber-300 shadow-sm flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-200 border border-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          🔥
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block font-mythic">
            El Veredicto de la Diosa Hestia
          </span>
          <p className="font-hand text-lg text-amber-950 mt-0.5 leading-snug">
            {quality.hestiaVerdict}
          </p>
        </div>
      </div>

      {/* Step by Step Score Breakdown (Separating Correct and Incorrect Actions) */}
      <div className="bg-white/90 rounded-3xl p-6 border-2 border-amber-200 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-4">
          <div>
            <h3 className="text-lg font-bold font-mythic text-stone-900">
              Desglose de Pasos Correctos e Incorrectos
            </h3>
            <p className="text-xs text-stone-500">
              Evaluación detallada de cada una de las 5 fases de la preparación (Máx. 12 puntos por paso)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Puntaje Total
            </span>
            <span className="text-xl font-black text-amber-900">
              {totalScore} / 60
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {stepScores.map((step) => {
            const isPerfect = step.score === step.maxScore;
            return (
              <div
                key={step.stepIndex}
                className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 flex flex-col gap-2.5 transition-all hover:bg-amber-50/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center">
                      {step.stepIndex + 1}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 font-mythic">
                      {step.stepName}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isPerfect
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : step.score >= 6
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {step.score} / {step.maxScore} Pts
                  </span>
                </div>

                {/* Actions Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {/* Correct actions */}
                  <div className="space-y-1">
                    {step.correctActions.length > 0 ? (
                      step.correctActions.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-stone-400 italic">Sin aciertos en este paso</span>
                    )}
                  </div>

                  {/* Incorrect actions */}
                  <div className="space-y-1">
                    {step.incorrectActions.length > 0 ? (
                      step.incorrectActions.map((err, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-rose-800">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{err}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                        ✨ ¡Paso ejecutado sin errores!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
