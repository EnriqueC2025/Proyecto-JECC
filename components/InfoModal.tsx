
import React from 'react';

interface InfoSection {
  h: string;
  p: string;
}

interface InfoEntry {
  title: string;
  icon: string;
  sections: InfoSection[];
}

const INFO_CONTENT: Record<string, InfoEntry> = {
  terms: {
    title: 'Términos de Servicio Académico',
    icon: 'gavel',
    sections: [
      {
        h: '1. Propiedad Intelectual',
        p: 'Todo contenido generado mediante GENERATIVE EDITION LAB AI debe ser utilizado bajo los marcos de ética académica vigentes. El usuario es responsable de citar el uso de IA en trabajos de investigación.'
      },
      {
        h: '2. Uso de Créditos',
        p: 'Los créditos son intransferibles y están vinculados a la cuenta institucional de GENERATIVE EDITION LAB AI. No se permite la comercialización masiva de activos generados sin licencia Enterprise.'
      },
      {
        h: '3. Privacidad de Datos',
        p: 'No almacenamos copias permanentes de sus borradores de texto más allá de la sesión actual de trabajo para garantizar la confidencialidad de sus ideas.'
      }
    ]
  },
  ethics: {
    title: 'Marco Ético de la Inteligencia Artificial',
    icon: 'psychology',
    sections: [
      {
        h: 'Responsabilidad Creativa',
        p: 'Fomentamos el uso de la IA como un copiloto creativo, no como un sustituto del pensamiento crítico humano.'
      },
      {
        h: 'Transparencia Algorítmica',
        p: 'Utilizamos modelos de Gemini optimizados para evitar sesgos cognitivos y generar contenido inclusivo y diverso en GENERATIVE EDITION LAB AI.'
      },
      {
        h: 'Seguridad de Contenido',
        p: 'Nuestra suite bloquea activamente la generación de contenido engañoso, violento o que infrinja derechos de autor de terceros.'
      }
    ]
  },
  support: {
    title: 'Centro de Soporte Institucional',
    icon: 'support_agent',
    sections: [
      {
        h: 'Asistencia Técnica',
        p: '¿Tienes problemas con la generación de imágenes? Contacta a soporte-it@generative-lab.ai.'
      },
      {
        h: 'Documentación de la Suite',
        p: 'Accede a nuestras guías de Prompt Engineering en el portal de la biblioteca virtual.'
      },
      {
        h: 'Reporte de Errores',
        p: 'Para bugs en la interfaz de GENERATIVE EDITION LAB AI, por favor adjunta una captura de pantalla y envíala a nuestro equipo de QA.'
      }
    ]
  }
};

interface InfoModalProps {
  type: 'terms' | 'ethics' | 'support';
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const current = INFO_CONTENT[type];

  // Seguridad: Si por alguna razón el tipo no coincide, no renderizamos nada para evitar crash.
  if (!current) {
    console.warn(`InfoModal: Tipo de contenido "${type}" no encontrado.`);
    return null;
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">{current.icon}</span>
            </div>
            <h3 className="text-2xl font-serif font-black dark:text-white leading-tight">{current.title}</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-10 overflow-y-auto space-y-8 no-scrollbar">
          {current.sections.map((sec, i) => (
            <section key={i} className="animate-in" style={{ animationDelay: `${i * 100}ms` }}>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">{sec.h}</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {sec.p}
              </p>
            </section>
          ))}
          
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold italic text-center">
                "Comprometidos con la excelencia académica y la innovación responsable."
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          <button 
            type="button"
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-12 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
