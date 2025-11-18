import React, { useState, useEffect } from 'react';
import { DrinkRecipe } from '../types';
import { generateDrinkImage } from '../services/geminiService';
import { RefreshCw, Loader2, ChefHat, GlassWater, Zap, Info, Image as ImageIcon } from 'lucide-react';

interface RecipeCardProps {
  recipe: DrinkRecipe;
  onReset: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onReset }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const url = await generateDrinkImage(recipe.name, recipe.description, recipe.glassware);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
      setImageError("Could not generate image at this time.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, [recipe]);

  return (
    <div className="max-w-3xl mx-auto w-full bg-slate-900/80 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md animate-fade-in">
      {/* Image Section */}
      <div className="relative w-full h-64 md:h-96 bg-slate-950 flex items-center justify-center group overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover animate-fade-in" 
          />
        ) : (
          <div className="text-center p-6 flex flex-col items-center justify-center w-full h-full">
            {isGeneratingImage ? (
               <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                     <Loader2 size={32} className="text-purple-500 animate-spin" />
                  </div>
                  <p className="text-slate-400 font-medium tracking-wide">Visualizing your drink...</p>
               </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <GlassWater size={40} className="text-slate-600" />
                </div>
                <p className="text-slate-500 mb-4">{imageError || "Image unavailable"}</p>
                <button 
                  onClick={generateImage}
                  className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-600"
                >
                  <RefreshCw size={16} />
                  <span>Retry Image</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Overlay Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold tracking-wider text-purple-200 uppercase z-10">
          {recipe.flavorProfile}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              {recipe.name}
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-xl">
              {recipe.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
             <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                <GlassWater size={14} />
                <span>{recipe.glassware}</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                <Zap size={14} className={recipe.difficulty === 'Hard' ? 'text-red-400' : recipe.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'} />
                <span>{recipe.difficulty}</span>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-pink-300 border-b border-pink-900/30 pb-2">
              <ChefHat size={20} />
              <h3 className="text-lg font-semibold uppercase tracking-wide">Ingredients</h3>
            </div>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-300 border-b border-blue-900/30 pb-2">
              <Info size={20} />
              <h3 className="text-lg font-semibold uppercase tracking-wide">Instructions</h3>
            </div>
            <ol className="space-y-4">
              {recipe.instructions.map((inst, idx) => (
                <li key={idx} className="flex gap-4 text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 border border-blue-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{inst}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex justify-center">
          <button
            onClick={onReset}
            className="group flex items-center gap-3 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-600 hover:border-slate-500"
          >
            <RefreshCw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
            <span className="font-semibold">Mix Another Drink</span>
          </button>
        </div>
      </div>
    </div>
  );
};