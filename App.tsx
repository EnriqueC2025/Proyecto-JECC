
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModuleA from './components/ModuleA';
import ModuleB from './components/ModuleB';
import Auth from './components/Auth';
import ProfileModal from './components/ProfileModal';
import InfoModal from './components/InfoModal';
import { GeneratedImage, HistoryEntry, Notification, NotificationSettings, User, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeInfoType, setActiveInfoType] = useState<'terms' | 'ethics' | 'support' | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    types: { success: true, info: true, warning: true },
    frequency: 'realtime'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('cs_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    if (notificationSettings.frequency === 'muted') return;
    if (!notificationSettings.types[type]) return;

    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 15));
  }, [notificationSettings]);

  const handleImageGenerated = (img: GeneratedImage) => {
    setGallery(prev => [img, ...prev]);
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: currentUser.credits - 10 };
      setCurrentUser(updatedUser);
      localStorage.setItem('cs_user', JSON.stringify(updatedUser));
    }
    addNotification('Imagen Generada', 'Nuevo activo visual procesado con éxito.', 'success');
  };

  const handleUpdateHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev]);
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: currentUser.credits - 5 };
      setCurrentUser(updatedUser);
      localStorage.setItem('cs_user', JSON.stringify(updatedUser));
    }
    addNotification('Texto Procesado', `Módulo de ${entry.title} completado.`, 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    addNotification('Historial Limpio', 'Se ha eliminado el registro de versiones del editor.', 'info');
  };

  const handleLogout = () => {
    localStorage.removeItem('cs_user');
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('cs_user', JSON.stringify(updatedUser));
    addNotification('Perfil Actualizado', 'Tus datos institucionales han sido guardados.', 'success');
  };

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  const roleLabels: Record<UserRole, { label: string, color: string }> = {
    [UserRole.ADMIN]: { label: 'Admin', color: 'bg-red-500' },
    [UserRole.EDITOR]: { label: 'Editor', color: 'bg-primary' },
    [UserRole.VIEWER]: { label: 'Lector', color: 'bg-gray-500' },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Navbar 
        user={currentUser}
        onLogout={handleLogout}
        onEditProfile={() => setIsProfileModalOpen(true)}
        notifications={notifications} 
        onMarkAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
      />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">GenAI v1.1</span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent"></div>
          </div>
          <div className="flex items-end gap-4 mb-3">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-gray-900 dark:text-white tracking-tight">
              Hola, {currentUser.name.split(' ')[0]}
            </h2>
            <span className={`mb-2 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest ${roleLabels[currentUser.role].color}`}>
              {roleLabels[currentUser.role].label}
            </span>
          </div>
          <p className="text-text-secondary dark:text-gray-400 text-lg max-w-2xl font-medium">
            Bienvenido a tu estación de generación de imágenes y edición creativa de contenido.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
          <ModuleA 
            gallery={gallery} 
            onImageGenerated={handleImageGenerated} 
            userRole={currentUser.role}
          />
          <ModuleB 
            history={history} 
            onUpdateHistory={handleUpdateHistory} 
            onClearHistory={handleClearHistory}
            userRole={currentUser.role}
          />
        </div>
      </main>

      {/* Modals placed at the end for proper stacking */}
      {isProfileModalOpen && (
        <ProfileModal 
          user={currentUser} 
          onClose={() => setIsProfileModalOpen(false)} 
          onUpdate={handleUpdateProfile} 
        />
      )}

      {activeInfoType && (
        <InfoModal 
          type={activeInfoType} 
          onClose={() => setActiveInfoType(null)} 
        />
      )}
      
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-400 uppercase">GENERATIVE EDITION LAB AI</span>
          <span className="text-gray-300">|</span>
          <p>&copy; {new Date().getFullYear()} GENERATIVE EDITION LAB AI Suite. Código abierto para colaboración. JECC REP. DOM.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            type="button"
            onClick={() => setActiveInfoType('terms')} 
            className="hover:text-primary transition-colors font-medium focus:outline-none"
          >
            Términos
          </button>
          <button 
            type="button"
            onClick={() => setActiveInfoType('ethics')} 
            className="hover:text-primary transition-colors font-medium focus:outline-none"
          >
            Ética de IA
          </button>
          <button 
            type="button"
            onClick={() => setActiveInfoType('support')} 
            className="hover:text-primary transition-colors font-medium focus:outline-none"
          >
            Soporte
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
