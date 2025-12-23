
import React, { useState, useEffect } from 'react';
import { ImageStyle, GeneratedImage, UserRole } from '../types';
import { generateImage } from '../services/geminiService';

interface ModuleAProps {
  onImageGenerated: (img: GeneratedImage) => void;
  gallery: GeneratedImage[];
  userRole: UserRole;
}

const ModuleA: React.FC<ModuleAProps> = ({ onImageGenerated, gallery, userRole }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(ImageStyle.REALISM);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const isReadOnly = userRole === UserRole.VIEWER;

  // Sincronizar la imagen seleccionada con la última generada
  useEffect(() => {
    if (gallery.length > 0 && !selectedImage) {
      setSelectedImage(gallery[0]);
    }
  }, [gallery, selectedImage]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isReadOnly) return;
    setIsGenerating(true);
    try {
      const url = await generateImage(prompt, selectedStyle);
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        style: selectedStyle,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onImageGenerated(newImg);
      setSelectedImage(newImg);
      setPrompt('');
    } catch (error) {
      alert("Error al generar la imagen. Por favor, inténtelo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="lg:col-span-5 flex flex-col h-full min-h-[600px]">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden glass-panel">
        
        {/* Cabecera del Módulo */}
        <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Estudio Visual</h3>
                <p className="text-xs text-gray-500">IA Generativa de Imágenes</p>
              </div>
            </div>
            {isReadOnly && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full uppercase">
                <span className="material-symbols-outlined text-xs">lock</span> Solo Lectura
              </span>
            )}
          </div>

          {/* Selector de Estilo */}
          <div className="flex items-center gap-2 px-6 pb-4 overflow-x-auto no-scrollbar">
            {Object.values(ImageStyle).map((style) => (
              <button
                key={style}
                disabled={isReadOnly}
                onClick={() => setSelectedStyle(style)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  selectedStyle === style 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo Principal: Input + Preview | Historial */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Lado Izquierdo: Generación y Preview */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 p-6 overflow-y-auto">
            <div className="space-y-4">
              <textarea 
                disabled={isReadOnly || isGenerating}
                className={`w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px] placeholder:text-gray-400 ${isReadOnly ? 'opacity-60' : ''}`}
                placeholder={isReadOnly ? "Acceso restringido para el rol de Lector" : "Describe tu visión creativa aquí..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || isReadOnly}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span className={`material-symbols-outlined text-xl ${isGenerating ? 'animate-spin' : ''}`}>
                  {isGenerating ? 'sync' : 'auto_awesome'}
                </span>
                {isGenerating ? 'Procesando...' : 'Generar Imagen'}
              </button>

              {/* Área de Previsualización Destacada */}
              {selectedImage ? (
                <div className="mt-6 animate-in">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 group">
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.prompt} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a 
                        href={selectedImage.url} 
                        download={`creative-suite-${selectedImage.id}.png`}
                        className="bg-white text-gray-900 size-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                      >
                        <span className="material-symbols-outlined">download</span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{selectedImage.style}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{selectedImage.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic line-clamp-3">"{selectedImage.prompt}"</p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-5xl mb-2 opacity-20">image_search</span>
                  <p className="text-sm font-medium opacity-50">Esperando creación...</p>
                </div>
              )}
            </div>
          </div>

          {/* Lado Derecho: Historial de Imágenes (Similar a ModuleB) */}
          <div className="w-48 lg:w-56 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col hidden sm:flex">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Generaciones</h4>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-3 no-scrollbar">
              {gallery.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-[10px] text-gray-400 font-medium italic">Sin historial previo</p>
                </div>
              ) : (
                gallery.map((img) => (
                  <div 
                    key={img.id} 
                    onClick={() => setSelectedImage(img)}
                    className={`group cursor-pointer p-2 rounded-xl border transition-all ${
                      selectedImage?.id === img.id 
                        ? 'bg-white dark:bg-gray-800 border-primary/30 shadow-md ring-1 ring-primary/20' 
                        : 'border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 shadow-sm">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white rounded">
                        {img.style.charAt(0)}
                      </div>
                    </div>
                    <div className="px-1 overflow-hidden">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mb-1">"{img.prompt}"</p>
                      <div className="flex items-center justify-between text-[8px] font-bold text-gray-400 uppercase">
                        <span>{img.style}</span>
                        <span>{img.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleA;
