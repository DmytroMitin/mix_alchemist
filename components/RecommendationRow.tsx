
import React from 'react';
import { Recommendation } from '../types';
import { Sparkles, ChevronRight, GlassWater } from 'lucide-react';

interface RecommendationRowProps {
  recommendations: Recommendation[];
  isLoading: boolean;
  onSelect: (name: string) => void;
}

export const RecommendationRow: React.FC<RecommendationRowProps> = ({ recommendations, isLoading, onSelect }) => {
  if (!isLoading && recommendations.length === 0) return null;

  return (
    <div className="w-full mb-10 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Sparkles size={16} className="text-purple-400" />
        <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wider">Trending Recommendations</h3>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-28 bg-slate-800/30 rounded-xl border border-slate-700/30 animate-pulse flex flex-col p-4 gap-2">
                <div className="h-5 w-3/4 bg-slate-700/50 rounded"></div>
                <div className="h-3 w-full bg-slate-700/30 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-700/30 rounded"></div>
            </div>
          ))
        ) : (
          recommendations.map((rec, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(rec.name)}
              className="group flex-shrink-0 w-64 p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-purple-900/20 hover:to-slate-900/90 border border-slate-700 hover:border-purple-500/50 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-200 group-hover:text-purple-300 transition-colors pr-2">{rec.name}</h4>
                    <GlassWater size={14} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{rec.description}</p>
              </div>
              
              <div className="relative z-10 mt-3 flex items-center text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                View Recipe <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative background glow */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-500"></div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
