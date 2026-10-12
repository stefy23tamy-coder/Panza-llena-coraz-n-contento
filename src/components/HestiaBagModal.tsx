import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Info } from 'lucide-react';
import { HESTIA_INGREDIENTS } from '../data/recipeData';
import { Ingredient } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartCooking?: () => void;
}

export const HestiaBagModal: React.FC<Props> = ({ isOpen, onClose, onStartCooking }) => {
  const [selectedIngredient, setSelectedIngredient] = React.useState<Ingredient>(HESTIA_INGREDIENTS[4]); // Miel de Hestia by default

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-amber-50 to-orange-50/90 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden text-stone-800"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-amber-50 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-3xl shadow-inner">
                🎒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-mythic tracking-wide">
                    El Bolsito Sagrado de Hestia
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/30 text-amber-100 border border-amber-300/40">
                    Regalo Divino
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-200 font-sans">
                  Contiene los 10 ingredientes para preparar los Brownies que curan huesos rotos
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

          {/* Body Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Ingredients Grid (Left 7 cols) */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
                <span>Ingredientes Disponibles ({HESTIA_INGREDIENTS.length})</span>
                <span className="text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Bendecidos por el Fuego
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {HESTIA_INGREDIENTS.map((item) => {
                  const isSelected = selectedIngredient?.id === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedIngredient(item);
                      }}
                      className={`relative p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-100 border-amber-600 shadow-md ring-2 ring-amber-400/50'
                          : item.isSpecial
                          ? 'bg-orange-50/80 border-orange-300 hover:border-amber-400 hover:bg-amber-50/80'
                          : 'bg-white/80 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-amber-100/60 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-stone-900 truncate">
                            {item.name}
                          </span>
                          {item.isSpecial && (
                            <span className="text-amber-600 text-xs" title="Ingrediente Sagrado">
                              ✨
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-500 truncate block">
                          {item.isSpecial ? '★ Ingrediente Divino' : 'Esencial para la masa'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Selected Ingredient Lore Panel (Right 5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between bg-white/80 rounded-2xl p-5 border-2 border-amber-200/80 shadow-inner">
              {selectedIngredient ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-md">
                      {selectedIngredient.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-stone-900">
                          {selectedIngredient.name}
                        </h3>
                        {selectedIngredient.isSpecial && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                            SAGRADO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-800 font-medium">
                        Bolsito Místico de la Diosa
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                        Descripción de Cocina
                      </span>
                      <p className="text-stone-700 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                        {selectedIngredient.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Poder Curativo de Hestia
                      </span>
                      <p className="text-stone-800 italic font-hand text-base leading-snug bg-orange-50/60 p-3 rounded-xl border border-orange-200/70 text-amber-950">
                        "{selectedIngredient.lore}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-stone-400">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Selecciona un ingrediente para examinar sus secretos</p>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-amber-100 flex flex-col gap-2">
                {onStartCooking && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sound.playMagicBlessing();
                      onClose();
                      onStartCooking();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold shadow-lg shadow-amber-600/30 hover:from-amber-500 hover:to-orange-500 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    Llevar Ingredientes a la Encimera
                  </motion.button>
                )}
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cerrar bolsito por ahora
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
