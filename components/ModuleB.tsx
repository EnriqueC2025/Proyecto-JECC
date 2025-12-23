
import React, { useState } from 'react';
import { HistoryEntry, UserRole } from '../types';
import { processContent } from '../services/geminiService';

interface ModuleBProps {
  history: HistoryEntry[];
  onUpdateHistory: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  userRole: UserRole;
}

const ModuleB: React.FC<ModuleBProps> = ({ history, onUpdateHistory, onClearHistory, userRole }) => {
  const [content, setContent] = useState(history[0]?.content || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isReadOnly = userRole === UserRole.VIEWER;

  const handleAction = async (action: 'summarize' | 'correct' | 'expand' | 'variations') => {
    if (!content.trim() || isReadOnly) return;
    setIsProcessing(true);
    try {
      const response = await processContent(action, content);
      
      let newText = '';
      if (Array.isArray(response.processed_text)) {
        newText = response.processed_text.join('\n\n---\n\n');
      } else {
        newText = response.processed_text;
      }

      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        type: action,
        title: action.charAt(0).toUpperCase() + action.slice(1),
        content: newText,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      onUpdateHistory(newEntry);
      setContent(newText);
    } catch (error) {
      alert("Error al procesar el texto.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation(); // Evitar seleccionar la versión al copiar
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const selectVersion = (entry: HistoryEntry) => {
    setContent(entry.content);
  };

  const confirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden glass-panel">
        <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Editor de Contenido</h3>
                <p className="text-xs text-gray-500">Redacción & Copywriting</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isReadOnly && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full uppercase">
                  <span className="material-symbols-outlined text-xs">lock</span> Solo Lectura
                </span>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                {isProcessing ? 'Procesando...' : 'Guardado'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
            <button 
              onClick={() => handleAction('summarize')}
              disabled={isProcessing || isReadOnly}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors shadow-sm disabled:opacity-50 ${isReadOnly ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <span className="material-symbols-outlined text-base text-primary">summarize</span>
              Resumir
            </button>
            <button 
              onClick={() => handleAction('correct')}
              disabled={isProcessing || isReadOnly}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors shadow-sm disabled:opacity-50 ${isReadOnly ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <span className="material-symbols-outlined text-base text-purple-500">spellcheck</span>
              Estilo
            </button>
            <button 
              onClick={() => handleAction('expand')}
              disabled={isProcessing || isReadOnly}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors shadow-sm disabled:opacity-50 ${isReadOnly ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <span className="material-symbols-outlined text-base text-orange-500">lightbulb</span>
              Expandir
            </button>
            <button 
              onClick={() => handleAction('variations')}
              disabled={isProcessing || isReadOnly}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors shadow-sm disabled:opacity-50 ${isReadOnly ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <span className="material-symbols-outlined text-base text-green-500">shuffle</span>
              Versiones
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto">
            <textarea 
              readOnly={isReadOnly}
              className={`w-full h-full p-8 text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200 resize-none border-none outline-none focus:ring-0 bg-transparent font-serif ${isReadOnly ? 'opacity-70' : ''}`}
              placeholder={isReadOnly ? "No tienes permisos para editar contenido." : "Escribe tu borrador aquí..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col hidden md:flex">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Historial</h4>
              {history.length > 0 && !isReadOnly && (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Limpiar todo el historial"
                >
                  <span className="material-symbols-outlined text-lg">delete_sweep</span>
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-3 no-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-gray-400 px-6 text-center">
                  <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Sin registro de versiones</p>
                </div>
              ) : (
                history.map((entry, idx) => (
                  <div 
                    key={entry.id} 
                    onClick={() => selectVersion(entry)}
                    className={`group cursor-pointer p-3 rounded-lg border transition-all ${
                      idx === 0 
                        ? 'bg-white dark:bg-gray-800 border-primary/30 shadow-sm' 
                        : 'border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold ${idx === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                        {entry.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => handleCopy(e, entry.content, entry.id)}
                          className={`p-1 rounded-md transition-colors ${copiedId === entry.id ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                          title="Copiar contenido"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedId === entry.id ? 'check' : 'content_copy'}
                          </span>
                        </button>
                        <span className="text-[10px] text-gray-400">{entry.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">"{entry.content}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación para Limpieza */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
            <div className="size-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">¿Eliminar historial?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Esta acción eliminará todas las versiones guardadas en la sesión actual. Los cambios no guardados en el editor se mantendrán, pero perderás el rastro de versiones anteriores.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmClear}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
              >
                Limpiar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleB;
