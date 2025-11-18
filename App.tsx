
import React, { useState, useEffect } from 'react';
import { ViewState, DrinkRecipe, Recommendation, Ingredient, IngredientCategory } from './types';
import { generateDrinkRecipe, getRecommendations, generateRecipeByName } from './services/geminiService';
import { IngredientSelector } from './components/IngredientSelector';
import { RecipeCard } from './components/RecipeCard';
import { RecommendationRow } from './components/RecommendationRow';
import { INGREDIENTS } from './constants';
import { Martini, Sparkles, AlertCircle, Loader } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('SELECTION');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<DrinkRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const recs = await getRecommendations();
        setRecommendations(recs);
      } catch (e) {
        console.error("Failed to load recommendations", e);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomIngredient = (name: string) => {
    const newId = `custom-${Date.now()}`;
    const newIngredient: Ingredient = {
      id: newId,
      name: name,
      category: IngredientCategory.CUSTOM
    };
    setCustomIngredients(prev => [...prev, newIngredient]);
    setSelectedIngredients(prev => [...prev, newId]);
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) return;
    
    setViewState('GENERATING_RECIPE');
    setError(null);

    try {
      // Map IDs back to names for the AI, checking both static and custom lists
      const allIngredients = [...INGREDIENTS, ...customIngredients];
      const names = selectedIngredients.map(id => 
        allIngredients.find(i => i.id === id)?.name || id
      );
      
      const result = await generateDrinkRecipe(names);
      setRecipe(result);
      setViewState('RESULT');
    } catch (err) {
      console.error(err);
      setError("The bartender is a bit overwhelmed. Please try again.");
      setViewState('SELECTION');
    }
  };

  const handleRecommendationSelect = async (name: string) => {
    setViewState('GENERATING_RECIPE');
    setError(null);
    try {
      const result = await generateRecipeByName(name);
      setRecipe(result);
      setViewState('RESULT');
    } catch (err) {
      console.error(err);
      setError("Could not fetch the recipe for this recommendation.");
      setViewState('SELECTION');
    }
  };

  const handleReset = () => {
    setViewState('SELECTION');
    setRecipe(null);
    // Optional: keep ingredients selected for easy modification
  };

  const handleClearSelection = () => {
    setSelectedIngredients([]);
  }

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-brand-dark/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Martini className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">MixAlchemist</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">AI COCKTAIL GENERATOR</p>
            </div>
          </div>
          
          {viewState === 'SELECTION' && selectedIngredients.length > 0 && (
             <div className="text-sm font-medium text-slate-400 hidden sm:block">
               {selectedIngredients.length} ingredients selected
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {viewState === 'SELECTION' && (
          <div className="animate-fade-in space-y-8">
            
            {/* Recommendations Row */}
            <RecommendationRow 
              recommendations={recommendations} 
              isLoading={loadingRecs} 
              onSelect={handleRecommendationSelect} 
            />

            <div className="text-center max-w-2xl mx-auto mb-12 pt-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
                What's in your bar?
              </h2>
              <p className="text-lg text-slate-400">
                Select the ingredients you have, and let our AI mixologist craft the perfect recipe for you.
              </p>
            </div>

            {error && (
               <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center justify-center gap-2 max-w-xl mx-auto mb-8">
                 <AlertCircle size={20} />
                 <span>{error}</span>
               </div>
            )}

            <IngredientSelector 
              selectedIds={selectedIngredients} 
              onToggle={toggleIngredient}
              customIngredients={customIngredients}
              onAddCustom={handleAddCustomIngredient}
            />

            {/* Floating Action Bar for Selection */}
            <div className="fixed bottom-8 left-0 right-0 z-40 px-4 pointer-events-none">
               <div className="max-w-md mx-auto flex items-center justify-between bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] pointer-events-auto transition-transform duration-300 transform translate-y-0">
                  <div className="text-slate-300 text-sm font-medium">
                    {selectedIngredients.length === 0 ? (
                      <span className="opacity-60">Select ingredients...</span>
                    ) : (
                      <span className="text-purple-300">{selectedIngredients.length} selected</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                     {selectedIngredients.length > 0 && (
                        <button 
                          onClick={handleClearSelection}
                          className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Clear
                        </button>
                     )}
                     <button
                       onClick={handleGenerate}
                       disabled={selectedIngredients.length === 0}
                       className={`
                         flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg
                         ${selectedIngredients.length > 0 
                           ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-purple-500/25 hover:scale-105 active:scale-95' 
                           : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                         }
                       `}
                     >
                       <Sparkles size={18} className={selectedIngredients.length > 0 ? "animate-pulse" : ""} />
                       <span>Mix It</span>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {viewState === 'GENERATING_RECIPE' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
              <Loader size={64} className="text-purple-500 animate-spin relative z-10" />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-white">Consulting the Spirits...</h2>
            <p className="text-slate-400 mt-2">Crafting the perfect recipe.</p>
          </div>
        )}

        {viewState === 'RESULT' && recipe && (
          <div className="pb-20">
             <RecipeCard recipe={recipe} onReset={handleReset} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
