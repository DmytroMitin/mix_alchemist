
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
}

export enum IngredientCategory {
  SPIRIT = 'Spirits',
  MIXER = 'Mixers',
  FRUIT = 'Fruits & Fresh',
  OTHER = 'Syrups & Others',
  CUSTOM = 'Your Additions',
}

export interface DrinkRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  glassware: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  flavorProfile: string;
}

export interface Recommendation {
  name: string;
  description: string;
}

export type ViewState = 'SELECTION' | 'GENERATING_RECIPE' | 'RESULT';
