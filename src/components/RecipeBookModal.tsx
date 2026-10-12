import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Flame, Check, Award } from 'lucide-react';
import { HESTIA_INGREDIENTS, COOKING_STEPS, QUALITY_TIERS } from '../data/recipeData';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeBookModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'brownies' | 'scoring'>('brownies');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-[#faf5ee] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden text-stone-800 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 text-amber-50 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-3xl shadow-inner">
                📜
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-mythic tracking-wide">
                  Libro Sagrado de Cocina de Hestia
                </h2>
                <p className="text-xs sm:text-sm text-amber-200 font-sans">
                  Instrucciones sagradas y catalogación de calidad (1 a 60 Puntos)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-amber-200 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-amber-200 bg-amber-100/60 px-6 pt-3 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('brownies');
              }}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'brownies'
                  ? 'border-amber-700 text-amber-950 font-mythic'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🍫</span> Receta: Brownies de Hestia (Nivel III)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('scoring');
              }}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'scoring'
                  ? 'border-amber-700 text-amber-950 font-mythic'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>Catalogación de Calidad (1–60 Pts)</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {activeTab === 'brownies' && (
              <div className="space-y-6">
                {/* Intro summary card */}
                <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                      Nivel III • Receta Sagrada
                    </span>
                    <h3 className="text-xl font-bold font-mythic text-amber-950 mt-1">
                      Brownies de Hestia
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      "Panza llena, corazón contento: el alimento bien hecho sana el cuerpo."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600">
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 font-bold">
                      🔥 175 °C
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 font-bold">
                      ⏱ 20–25 min
                    </span>
                  </div>
                </div>

                {/* Ingredients list */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Ingredientes del Bolsito Sagrado (10 en total)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {HESTIA_INGREDIENTS.map((ing) => (
                      <div
                        key={ing.id}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                          ing.isSpecial
                            ? 'bg-amber-100/90 border-amber-400 font-bold text-amber-950 shadow-sm'
                            : 'bg-white border-stone-200 text-stone-800'
                        }`}
                      >
                        <span className="text-xl">{ing.icon}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block truncate">
                            {ing.name}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {ing.isSpecial ? '★ Ingrediente Divino' : ing.description.slice(0, 30) + '...'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step by step */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-600" />
                    Los 5 Pasos para Conseguir los 60 Puntos
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-stone-900 text-sm font-mythic">
                        Paso 1 — Derretir (12 pts)
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1">
                        Derrite el chocolate negro con la mantequilla a <strong>fuego bajo</strong>, removiendo para evitar que se queme.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-stone-900 text-sm font-mythic">
                        Paso 2 — Mezclar (12 pts)
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1">
                        Bate los 2 huevos con el azúcar hasta que quede <strong>ligeramente espumosa</strong>. Después incorpora <strong>poco a poco</strong> el chocolate derretido.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-stone-900 text-sm font-mythic">
                        Paso 3 — El ingrediente especial (12 pts)
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1">
                        Añade la miel de Hestia y la canela del hogar. <strong>Debe hacerlo cuando la mezcla esté tibia</strong>, para no debilitar la comida.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-stone-900 text-sm font-mythic">
                        Paso 4 — La harina (12 pts)
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1">
                        Añade la harina, el cacao y la sal. <strong>Mezcla suavemente</strong> con movimientos envolventes hasta que no queden restos de harina.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-stone-900 text-sm font-mythic">
                        Paso 5 — Hornear (12 pts)
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1">
                        Hornear exactamente a <strong>175 °C</strong> durante <strong>20–25 minutos</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scoring' && (
              <div className="space-y-4">
                <div className="bg-amber-100/60 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-stone-700">
                  <p>
                    Cada uno de los 5 pasos se evalúa con un máximo de <strong>12 puntos</strong> (Total: 60 puntos). Al finalizar el horneado, se catalogará la calidad exacta del brownie en base a tus aciertos y errores.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {QUALITY_TIERS.map((tier) => (
                    <div
                      key={tier.tierName}
                      className="p-4 rounded-2xl border-2 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black font-mythic text-amber-900 text-sm">
                            {tier.minScore}–{tier.maxScore} Pts
                          </span>
                          <span className="font-bold text-stone-900 text-sm">
                            {tier.tierName}
                          </span>
                          <span className="text-xs text-amber-600 font-bold">
                            ({tier.badge})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                          {tier.title}: {tier.description}
                        </p>
                      </div>

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                        {'★'.repeat(tier.stars)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-amber-50/80 border-t border-amber-200 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="py-2.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs shadow-md"
            >
              Cerrar y volver a cocinar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
