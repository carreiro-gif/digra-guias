import React, { useEffect, useState } from 'react';
import { Guia } from './types';

// Firestore service
import { ouvirGuias } from './services/firestoreService';

// Icons
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
  </svg>
);

// LOGO
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div
    className={`rounded-full bg-[#004aad] border-2 border-white flex items-center justify-center font-bold text-white ${
      size === 'large' ? 'w-20 h-20' : 'w-10 h-10 text-xs'
    }`}
  >
    DIGRA
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [guias, setGuias] = useState<Guia[]>([]);

  // 🔥 Firestore realtime (seguro)
  useEffect(() => {
    const unsubscribe = ouvirGuias((dados) => {
      const dadosValidos = dados.filter(
        (g) => g && g.orgaoSnapshot && g.orgaoSnapshot.sigla
      );
      setGuias(dadosValidos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-10 space-y-6">
      <header className="flex items-center gap-4">
        <LogoDigra />
        <h1 className="text-2xl font-bold">Sistema de Guias de Remessa</h1>
      </header>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('form')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <IconPlus /> Nova Guia
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded"
        >
          <IconList /> Histórico
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-3">
          {guias.length === 0 && (
            <p className="text-slate-500">Nenhuma guia cadastrada.</p>
          )}

          {guias.map((g: any) => (
            <div
              key={g.id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <strong>{g.numero}</strong> —{' '}
                {g.orgaoSnapshot?.sigla ?? 'Órgão não definido'}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'form' && (
        <p className="text-slate-500">
          Formulário será exibido aqui.
        </p>
      )}

      <footer className="text-xs text-slate-500 mt-10">
        ⚡ Alexandre | DIGRA Apps
      </footer>
    </div>
  );
}

export default App;
