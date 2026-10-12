import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, BookOpen, Volume2, VolumeX, ChefHat, Award, RotateCcw } from 'lucide-react';
import { HestiaBagModal } from './components/HestiaBagModal';
import { RecipeBookModal } from './components/RecipeBookModal';
import { IntroScreen } from './components/IntroScreen';
import { Step1Melt } from './components/cooking/Step1Melt';
import { Step2Mix } from './components/cooking/Step2Mix';
import { Step3Special } from './components/cooking/Step3Special';
import { Step4Flour } from './components/cooking/Step4Flour';
import { Step5Bake } from './components/cooking/Step5Bake';
import { BrownieQualityView } from './components/BrownieQualityView';
import { CookingStepIndex, StepScoreDetail } from './types/game';
import { sound } from './utils/sound';

const DEFAULT_STEP_SCORES: StepScoreDetail[] = [
  { stepIndex: 0, stepName: 'Paso 1: Derretir Chocolate y Mantequilla', score: 0, maxScore: 12, correctActions: [], incorrectActions: [] },
  { stepIndex: 1, stepName: 'Paso 2: Mezclar Huevos, Azúcar y Chocolate', score: 0, maxScore: 12, correctActions: [], incorrectActions: [] },
  { stepIndex: 2, stepName: 'Paso 3: El Ingrediente Especial (Miel y Canela)', score: 0, maxScore: 12, correctActions: [], incorrectActions: [] },
  { stepIndex: 3, stepName: 'Paso 4: La Harina, Cacao y Mezcla Suave', score: 0, maxScore: 12, correctActions: [], incorrectActions: [] },
  { stepIndex: 4, stepName: 'Paso 5: Hornear a 175 °C por 20–25 Minutos', score: 0, maxScore: 12, correctActions: [], incorrectActions: [] },
];

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'kitchen' | 'quality'>('intro');
  const [cookingStep, setCookingStep] = useState<CookingStepIndex>(0);
  const [stepScores, setStepScores] = useState<StepScoreDetail[]>(DEFAULT_STEP_SCORES);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const handleStepComplete = (scoreDetail: StepScoreDetail) => {
    setStepScores((prev) =>
      prev.map((s) => (s.stepIndex === scoreDetail.stepIndex ? scoreDetail : s))
    );

    if (scoreDetail.stepIndex < 4) {
      setCookingStep((scoreDetail.stepIndex + 1) as CookingStepIndex);
    } else {
      setScreen('quality');
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setStepScores(DEFAULT_STEP_SCORES);
    setCookingStep(0);
    setScreen('kitchen');
  };

  const currentTotalScore = stepScores.reduce((acc, s) => acc + s.score, 0);

  const stepNames = [
    '1. Derretir',
    '2. Mezclar',
    '3. Miel y Canela',
    '4. Harina',
    '5. Hornear',
  ];

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-stone-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-900 via-amber-800 to-orange-950 text-amber-50 shadow-lg border-b-2 border-amber-500/40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Game Title */}
          <div
            onClick={() => {
              sound.playClick();
              setScreen('intro');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mythic font-black text-base sm:text-lg tracking-wide text-amber-100">
                  Panza Llena, Corazón Contento
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  NIVEL III
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 font-sans hidden sm:block">
                El Fuego Sagrado de Hestia • Brownies (1 a 60 Pts)
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Score indicator if cooking or viewing quality */}
            {screen !== 'intro' && (
              <div
                title="Puntuación acumulada (Máx 60)"
                className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs font-bold text-amber-200"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {currentTotalScore} <span className="text-[10px] opacity-70">/ 60 Pts</span>
                </span>
              </div>
            )}

            {/* Quick Screen Switcher */}
            {screen === 'quality' && (
              <button
                onClick={handleRestart}
                className="py-1.5 px-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-amber-400"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Cocinar de Nuevo</span>
              </button>
            )}

            {/* Sacred Bag Button */}
            <button
              onClick={() => {
                sound.playBagOpen();
                setIsBagOpen(true);
              }}
              title="Abrir Bolsito de Hestia"
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-300/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="text-sm">🎒</span>
              <span className="hidden sm:inline">Bolsito</span>
            </button>

            {/* Recipe Book Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsRecipeBookOpen(true);
              }}
              title="Libro de Recetas Sagradas"
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-300/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Receta y Calidad</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-300/30 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {screen === 'intro' && (
          <IntroScreen
            onStartGame={() => {
              setScreen('kitchen');
              setCookingStep(0);
            }}
            onOpenBag={() => setIsBagOpen(true)}
          />
        )}

        {screen === 'kitchen' && (
          <div className="w-full flex flex-col items-center">
            {/* Step Navigation Tabs */}
            <div className="w-full max-w-3xl mb-6 bg-white/90 p-2 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between overflow-x-auto gap-1">
              {stepNames.map((name, idx) => {
                const isActive = cookingStep === idx;
                const isPast = cookingStep > idx;
                const stepScore = stepScores[idx]?.score || 0;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setCookingStep(idx as CookingStepIndex);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                        : isPast
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    <span>{name}</span>
                    {isPast && (
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 rounded-full">
                        {stepScore}/12
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Cooking Step Component */}
            <div className="w-full">
              {cookingStep === 0 && <Step1Melt onComplete={handleStepComplete} />}
              {cookingStep === 1 && <Step2Mix onComplete={handleStepComplete} />}
              {cookingStep === 2 && <Step3Special onComplete={handleStepComplete} />}
              {cookingStep === 3 && <Step4Flour onComplete={handleStepComplete} />}
              {cookingStep === 4 && <Step5Bake onComplete={handleStepComplete} />}
            </div>
          </div>
        )}

        {screen === 'quality' && (
          <BrownieQualityView
            stepScores={stepScores}
            onCookAgain={handleRestart}
            onOpenRecipeBook={() => setIsRecipeBookOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 px-4 text-center text-xs text-stone-500 border-t border-amber-200/80 bg-amber-50/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-900 font-semibold font-mythic">
            <span>🔥</span>
            <span>Templo del Fuego Sagrado de Hestia</span>
          </div>
          <div className="text-stone-600 font-hand text-sm">
            "Panza llena, corazón contento: cada paso correcto eleva la calidad divina."
          </div>
          <div className="text-[11px] text-stone-400 font-semibold">
            Catalogación de Calidad: 1 a 60 Pts
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HestiaBagModal
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onStartCooking={() => {
          setScreen('kitchen');
          setCookingStep(0);
        }}
      />

      <RecipeBookModal
        isOpen={isRecipeBookOpen}
        onClose={() => setIsRecipeBookOpen(false)}
      />
    </div>
  );
}
