import { Ingredient, QualityTier } from '../types/game';

export const HESTIA_INGREDIENTS: Ingredient[] = [
  {
    id: 'chocolate',
    name: 'Chocolate negro',
    category: 'base',
    icon: '🍫',
    description: 'Cacao puro y oscuro de aroma intenso y amargor noble.',
    lore: 'Aporta la base reconfortante y la consistencia sedosa para reparar la fuerza vital.'
  },
  {
    id: 'mantequilla',
    name: 'Mantequilla',
    category: 'base',
    icon: '🧈',
    description: 'Mantequilla cremosa de leche dorada batida en los valles sagrados.',
    lore: 'Otorga suavidad que ayuda a derretir el chocolate sin quemarlo.'
  },
  {
    id: 'azucar',
    name: 'Azúcar',
    category: 'base',
    icon: '🍚',
    description: 'Cristales de caña dulce y fina.',
    lore: 'Se bate con los huevos para crear una espuma elástica y una costra crujiente.'
  },
  {
    id: 'huevos',
    name: '2 Huevos',
    category: 'base',
    icon: '🥚',
    description: 'Dos huevos frescos de las aves de los olivares sagrados.',
    lore: 'Dan estructura esponjosa y aire a la masa al batirse vigorosamente.'
  },
  {
    id: 'miel_hestia',
    name: 'Miel de Hestia',
    category: 'sacred',
    icon: '🍯',
    description: 'El ingrediente divino: miel de abejas doradas bendecidas por la llama del hogar.',
    lore: '¡Ingrediente especial! Debe agregarse con la mezcla tibia. Cura fracturas y renueva el espíritu.',
    isSpecial: true
  },
  {
    id: 'canela_hogar',
    name: 'Canela del hogar',
    category: 'sacred',
    icon: '🪵',
    description: 'Corteza perfumada tostada levemente al fuego sagrado.',
    lore: 'Despierta el calor interior que guía la reconexión ósea celular.',
    isSpecial: true
  },
  {
    id: 'harina',
    name: 'Harina',
    category: 'base',
    icon: '🌾',
    description: 'Harina de trigo fino tamizada cuidadosamente.',
    lore: 'Unifica todos los elementos en un bocado denso y tierno.'
  },
  {
    id: 'cacao',
    name: 'Cacao en polvo',
    category: 'flavor',
    icon: '🟤',
    description: 'Polvo puro de cacao tostado con fragancia terrosa.',
    lore: 'Profundiza el sabor a chocolate hasta niveles legendarios.'
  },
  {
    id: 'sal',
    name: 'Una pizca de sal',
    category: 'flavor',
    icon: '🧂',
    description: 'Sal marina recolectada en las calas del mar Egeo.',
    lore: 'Potencia la dulzura mística y equilibra los sabores divinos.'
  },
  {
    id: 'vainilla',
    name: 'Vainilla',
    category: 'flavor',
    icon: '🌸',
    description: 'Extracto aromático de vainas fragantes.',
    lore: 'Añade un fondo tibio y nostálgico que reconforta el alma.'
  }
];

export const QUALITY_TIERS: QualityTier[] = [
  {
    minScore: 55,
    maxScore: 60,
    tierName: 'Calidad Divina Olímpica',
    badge: '👑 Grado Celestial',
    stars: 5,
    title: 'Obra Maestra del Fuego Sagrado',
    description: 'Brownies con una superficie craquelada brillante perfecta, centro ultra húmedo y meloso (fudgy), aroma envolvente a canela tostada y miel pura.',
    textureEvaluation: 'Textura inmaculada: centro denso y chocolatoso, sin grumos, con un velo fino y crujiente en la corteza superior.',
    healingEffect: 'Milagro Supremo de Nivel III: Fusión instantánea de cualquier hueso fracturado. Regeneración total de fuerza y ánimo.',
    hestiaVerdict: '«Hija mía, has honrado el fuego del hogar con precisión sagrada. La temperatura, el batido y la devoción hacen de este bocado la bendición más sublime.»',
    colorClass: 'from-amber-500 via-yellow-400 to-amber-600 border-amber-300 text-amber-950'
  },
  {
    minScore: 45,
    maxScore: 54,
    tierName: 'Calidad Maestra del Templo',
    badge: '⭐ Grado Sacerdotisa',
    stars: 4,
    title: 'Brownie Reconfortante y Curativo',
    description: 'Muy buen sabor a chocolate profundo y notas dulces de miel. Excelente consistencia con ligeros matices a mejorar en temperatura o tiempo.',
    textureEvaluation: 'Buena humedad interna, corteza dorada y sabor balanceado. La miel y la canela están bien presentes.',
    healingEffect: 'Poder Curativo de Nivel III: Cura fracturas óseas limpias en cuestión de minutos y alivia el dolor al instante.',
    hestiaVerdict: '«Un brownie digno de los altares. Pequeños detalles de técnica te separan de la perfección divina, pero tu corazón y tus manos son diestras.»',
    colorClass: 'from-emerald-600 via-teal-600 to-emerald-700 border-emerald-300 text-emerald-950'
  },
  {
    minScore: 30,
    maxScore: 44,
    tierName: 'Calidad Aceptable de Novicia',
    badge: '📜 Grado Aprendiz',
    stars: 3,
    title: 'Brownie Casero con Imperfecciones',
    description: 'El brownie es comestible y sabe bien, pero hubo descuidos: quizás el fuego estuvo algo alto, la mezcla no estuvo tibia al añadir la miel, o el horno varió de 175°C.',
    textureEvaluation: 'Algo más seco o apelmazado de lo deseado; la costra no terminó de brillar o la masa perdió parte de su aireado.',
    healingEffect: 'Curación Parcial: Alivia las fisuras óseas leves, pero tarda horas en regenerar fracturas completas.',
    hestiaVerdict: '«No temas al error, novicia. Recuerda escuchar la llama: fuego bajo para derretir, mezcla tibia para la miel y exactamente 175°C en el horno.»',
    colorClass: 'from-blue-600 via-sky-600 to-blue-700 border-sky-300 text-blue-950'
  },
  {
    minScore: 15,
    maxScore: 29,
    tierName: 'Calidad Deficiente',
    badge: '⚠️ Grado Rústico',
    stars: 2,
    title: 'Brownie Sobrecalentado o Desbalanceado',
    description: 'Varios pasos se realizaron de forma incorrecta: ingredientes a destiempo, fuego excesivo o miel añadida hirviendo que debilitó la mezcla curativa.',
    textureEvaluation: 'Aspecto gomoso o reseco, bordes duros y centro que perdió su brillo chocolateado.',
    healingEffect: 'Sin Poder Curativo: Llena la panza pero no tiene la magia de Hestia para soldar huesos rotos.',
    hestiaVerdict: '«El fuego fue impaciente. La cocina de Hestia requiere ternura y orden en los ingredientes. Vuelve a intentarlo con serenidad.»',
    colorClass: 'from-orange-700 via-amber-800 to-stone-800 border-orange-400 text-stone-100'
  },
  {
    minScore: 1,
    maxScore: 14,
    tierName: 'Desastre en el Brasero',
    badge: '💥 Calidad Fallida',
    stars: 1,
    title: 'Masa Quemada o Malograda',
    description: 'El chocolate se quemó a fuego alto, los ingredientes se colocaron desordenados y el horno no tuvo la temperatura requerida.',
    textureEvaluation: 'Sabor amargo a quemado, masa pastosa o apelmazada con grumos de harina cruda.',
    healingEffect: 'Efecto Nulo: Podría causar dolor de estómago antes que curar ningún hueso.',
    hestiaVerdict: '«Las brasas se desbocaron. No te desanimes: limpia la cazuela sagrada, abre el bolsito de nuevo y sigue cada paso con calma.»',
    colorClass: 'from-rose-800 via-red-900 to-stone-900 border-rose-400 text-stone-100'
  }
];

export function getQualityTier(score: number): QualityTier {
  const boundedScore = Math.max(1, Math.min(60, score));
  return (
    QUALITY_TIERS.find(
      (t) => boundedScore >= t.minScore && boundedScore <= t.maxScore
    ) || QUALITY_TIERS[QUALITY_TIERS.length - 1]
  );
}

export const COOKING_STEPS = [
  {
    index: 0,
    title: 'Paso 1 — Derretir',
    subtitle: 'Chocolate negro y Mantequilla a fuego bajo',
    instruction: 'Derrite el chocolate junto con la mantequilla a fuego bajo, removiendo para evitar que se queme.',
    hestiaTip: 'Mantén la llama baja en el brasero; el chocolate es delicado y necesita calor paciente y amoroso.'
  },
  {
    index: 1,
    title: 'Paso 2 — Mezclar',
    subtitle: 'Huevos y Azúcar con Chocolate',
    instruction: 'Bate los huevos con el azúcar hasta que la mezcla quede ligeramente espumosa. Después incorpora poco a poco el chocolate derretido.',
    hestiaTip: 'Un buen batido atrapa el aire de la vida. Vierte el chocolate en un hilo suave mientras remueves.'
  },
  {
    index: 2,
    title: 'Paso 3 — El ingrediente especial',
    subtitle: 'Miel de Hestia y Canela del hogar',
    instruction: 'Añade la miel de Hestia y una pizca de canela del hogar. Debe hacerlo cuando la mezcla esté tibia, para no debilitar la comida.',
    hestiaTip: '¡Atenta a la temperatura! Si la mezcla está hirviendo, el poder sagrado se disipa. ¡Tibia es la clave!'
  },
  {
    index: 3,
    title: 'Paso 4 — La harina',
    subtitle: 'Harina, Cacao y Sal',
    instruction: 'Añade la harina, el cacao y la sal. Mezcla suavemente hasta que no queden restos de harina.',
    hestiaTip: 'Movimientos envolventes con la cuchara de madera. No sobrebatas para que el brownie quede tierno.'
  },
  {
    index: 4,
    title: 'Paso 5 — Hornear',
    subtitle: 'El Horno Sagrado a 175 °C',
    instruction: 'Hornear a 175 °C durante unos 20–25 minutos.',
    hestiaTip: 'Ajusta exactamente a 175°C. El centro debe quedar jugoso y la corteza brillante y crujiente.'
  }
];
