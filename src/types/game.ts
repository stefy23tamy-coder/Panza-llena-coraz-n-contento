export interface Ingredient {
  id: string;
  name: string;
  category: 'base' | 'sacred' | 'flavor';
  icon: string;
  description: string;
  lore: string;
  isSpecial?: boolean;
}

export type CookingStepIndex = 0 | 1 | 2 | 3 | 4;

export interface StepScoreDetail {
  stepIndex: CookingStepIndex;
  stepName: string;
  score: number; // 0 to 12
  maxScore: number; // 12
  correctActions: string[];
  incorrectActions: string[];
}

export interface QualityTier {
  minScore: number;
  maxScore: number;
  tierName: string;
  badge: string;
  stars: number;
  title: string;
  description: string;
  textureEvaluation: string;
  healingEffect: string;
  hestiaVerdict: string;
  colorClass: string;
}
