import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ArrowRight, Award } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  onStartGame: () => void;
  onOpenBag: () => void;
}

export const IntroScreen: React.FC<Props> = ({ onStartGame, onOpenBag }) => {
  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center py-6 px-4">
      {/* Sacred Goddess Emblem */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 p-1 shadow-2xl animate-warm-pulse flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-stone-900 border-4 border-amber-300/80 flex flex-col items-center justify-center text-4xl sm:text-5xl">
            🔥
          </div>
        </div>
        <div className="absolute -bottom-2 bg-amber-400 text-stone-950 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">
          Diosa Hestia
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Fábula Sagrada de la Sacerdotisa y la Cocina Divina</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-mythic tracking-tight text-amber-950 leading-tight">
          Panza Llena,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800">
            Corazón Contento
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-700 leading-relaxed font-sans">
          La diosa <strong className="text-amber-900">Hestia</strong> te ha entregado su <strong className="text-amber-900">bolsito de ingredientes</strong>. Aprende a colocar los ingredientes correctamente en cada fase para obtener hasta <strong className="text-amber-900">60 puntos</strong> y catalogar la calidad suprema del brownie curativo de huesos rotos.
        </p>
      </motion.div>

      {/* Level III Highlight Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl my-8 bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden text-left"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-amber-950 uppercase tracking-widest shadow-sm">
            NIVEL III • RETO DE CALIDAD (1 A 60 PTS)
          </span>
          <span className="text-xs text-amber-300 flex items-center gap-1 font-mythic">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> El Fuego Curativo
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black font-mythic text-amber-50 mb-2">
          Brownies de Hestia
        </h3>
        <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed font-sans mb-4">
          Tus decisiones en cada paso determinarán la calidad: derretir a fuego bajo, batir los huevos hasta que queden espumosos, añadir la <strong className="text-amber-300">miel de Hestia</strong> y <strong className="text-amber-300">canela del hogar</strong> cuando la mezcla esté tibia, tamizar la harina suavemente y hornear exactamente a 175°C por 20–25 minutos.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-700/50 text-xs text-amber-200">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🍫</span> Chocolate Negro
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🧈</span> Mantequilla
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🍯</span> Miel de Hestia
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🪵</span> Canela del Hogar
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🥚</span> 2 Huevos Frescos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏆</span> 1 a 60 Puntos
          </div>
        </div>
      </motion.div>

      {/* Call to Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center"
      >
        <button
          onClick={() => {
            sound.playMagicBlessing();
            onStartGame();
          }}
          className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-base shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <span>Empezar a Cocinar</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            sound.playBagOpen();
            onOpenBag();
          }}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-300 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <span>🎒</span> Ver Bolsito de Hestia
        </button>
      </motion.div>
    </div>
  );
};
