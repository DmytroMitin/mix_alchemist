
import React, { useMemo, useState } from 'react';
import { INGREDIENTS, CATEGORY_ICONS } from '../constants';
import { IngredientCategory, Ingredient } from '../types';
import { Check, Plus, Search } from 'lucide-react';

interface IngredientSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  customIngredients: Ingredient[];
  onAddCustom: (name: string) => void;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({ selectedIds, onToggle, customIngredients, onAddCustom }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddCustom(newItem.trim());
      setNewItem('');
    }
  };

  // Group ingredients by category
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {};
    Object.values(IngredientCategory).forEach(cat => {
      groups[cat] = [];
    });
    
    // Add static ingredients
    INGREDIENTS.forEach(i => {
       if(groups[i.category]) groups[i.category].push(i);
    });

    // Add custom ingredients
    customIngredients.forEach(i => {
       if(groups[i.category]) groups[i.category].push(i);
    });

    return groups;
  }, [customIngredients]);

  // Define display order explicitly to show Custom Additions first
  const displayOrder = [
    IngredientCategory.CUSTOM,
    IngredientCategory.SPIRIT,
    IngredientCategory.MIXER,
    IngredientCategory.FRUIT,
    IngredientCategory.OTHER,
  ];

  return (
    <div className="space-y-8">
      
      {/* Add New Ingredient Input */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg">
         <form onSubmit={handleAdd} className="flex gap-3">
            <div className="relative flex-1">
               <input
                 type="text"
                 value={newItem}
                 onChange={(e) => setNewItem(e.target.value)}
                 placeholder="Add any other ingredient (e.g. 'Dragon Fruit', 'Chili Pepper')..."
                 className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-500"
               />
               <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>
            <button 
               type="submit"
               disabled={!newItem.trim()}
               className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20"
            >
               <span>Add</span>
            </button>
         </form>
      </div>

      {displayOrder.map((category) => {
        const items = groupedIngredients[category];
        const Icon = CATEGORY_ICONS[category];
        
        if (!items || items.length === 0) return null;

        return (
          <div key={category} className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4 text-purple-300 border-b border-purple-900/50 pb-2">
              {Icon && <Icon size={20} />}
              <h3 className="text-lg font-semibold uppercase tracking-wider">{category}</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {items.map((ingredient) => {
                const isSelected = selectedIds.includes(ingredient.id);
                
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => onToggle(ingredient.id)}
                    className={`
                      group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                      ${isSelected 
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                      }
                    `}
                  >
                    <span className="text-sm font-medium text-left truncate mr-2">{ingredient.name}</span>
                    
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center border transition-all flex-shrink-0
                      ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-600 group-hover:border-slate-400'}
                    `}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
