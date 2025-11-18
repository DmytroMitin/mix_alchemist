
import { Ingredient, IngredientCategory } from './types';
import { Wine, GlassWater, Citrus, Palette, Plus } from 'lucide-react';

export const INGREDIENTS: Ingredient[] = [
  // Spirits
  { id: 'vodka', name: 'Vodka', category: IngredientCategory.SPIRIT },
  { id: 'gin', name: 'Gin', category: IngredientCategory.SPIRIT },
  { id: 'white_rum', name: 'White Rum', category: IngredientCategory.SPIRIT },
  { id: 'dark_rum', name: 'Dark Rum', category: IngredientCategory.SPIRIT },
  { id: 'tequila', name: 'Tequila', category: IngredientCategory.SPIRIT },
  { id: 'whiskey', name: 'Whiskey/Bourbon', category: IngredientCategory.SPIRIT },
  { id: 'brandy', name: 'Brandy/Cognac', category: IngredientCategory.SPIRIT },
  { id: 'vermouth_dry', name: 'Dry Vermouth', category: IngredientCategory.SPIRIT },
  { id: 'vermouth_sweet', name: 'Sweet Vermouth', category: IngredientCategory.SPIRIT },
  { id: 'campari', name: 'Campari', category: IngredientCategory.SPIRIT },
  { id: 'cointreau', name: 'Cointreau/Triple Sec', category: IngredientCategory.SPIRIT },

  // Mixers
  { id: 'soda', name: 'Soda Water', category: IngredientCategory.MIXER },
  { id: 'tonic', name: 'Tonic Water', category: IngredientCategory.MIXER },
  { id: 'cola', name: 'Cola', category: IngredientCategory.MIXER },
  { id: 'ginger_beer', name: 'Ginger Beer', category: IngredientCategory.MIXER },
  { id: 'ginger_ale', name: 'Ginger Ale', category: IngredientCategory.MIXER },
  { id: 'oj', name: 'Orange Juice', category: IngredientCategory.MIXER },
  { id: 'cranberry', name: 'Cranberry Juice', category: IngredientCategory.MIXER },
  { id: 'pineapple', name: 'Pineapple Juice', category: IngredientCategory.MIXER },
  { id: 'tomato', name: 'Tomato Juice', category: IngredientCategory.MIXER },

  // Fruits & Fresh
  { id: 'lemon', name: 'Lemon', category: IngredientCategory.FRUIT },
  { id: 'lime', name: 'Lime', category: IngredientCategory.FRUIT },
  { id: 'orange', name: 'Orange', category: IngredientCategory.FRUIT },
  { id: 'grapefruit', name: 'Grapefruit', category: IngredientCategory.FRUIT },
  { id: 'mint', name: 'Fresh Mint', category: IngredientCategory.FRUIT },
  { id: 'basil', name: 'Fresh Basil', category: IngredientCategory.FRUIT },
  { id: 'cucumber', name: 'Cucumber', category: IngredientCategory.FRUIT },
  { id: 'berries', name: 'Mixed Berries', category: IngredientCategory.FRUIT },

  // Others
  { id: 'simple_syrup', name: 'Simple Syrup', category: IngredientCategory.OTHER },
  { id: 'honey', name: 'Honey', category: IngredientCategory.OTHER },
  { id: 'agave', name: 'Agave Nectar', category: IngredientCategory.OTHER },
  { id: 'grenadine', name: 'Grenadine', category: IngredientCategory.OTHER },
  { id: 'bitters', name: 'Angostura Bitters', category: IngredientCategory.OTHER },
  { id: 'cream', name: 'Heavy Cream', category: IngredientCategory.OTHER },
  { id: 'egg_white', name: 'Egg White', category: IngredientCategory.OTHER },
  { id: 'coffee', name: 'Espresso/Coffee', category: IngredientCategory.OTHER },
];

export const CATEGORY_ICONS: Record<IngredientCategory, any> = {
  [IngredientCategory.SPIRIT]: Wine,
  [IngredientCategory.MIXER]: GlassWater,
  [IngredientCategory.FRUIT]: Citrus,
  [IngredientCategory.OTHER]: Palette,
  [IngredientCategory.CUSTOM]: Plus,
};
