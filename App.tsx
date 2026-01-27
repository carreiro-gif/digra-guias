import React, { useState, useEffect } from 'react';
import { Guia, Orgao, Operador, ResponsavelExterno, ServicoPreco } from './types';

import { GuiaForm } from './components/GuiaForm';
import { GuiaPrint } from './components/GuiaPrint';
import { OrgaoManager } from './components/OrgaoManager';
import { OperadorManager } from './components/OperadorManager';
import { ResponsavelManager } from './components/ResponsavelManager';
import { ServicoManager } from './components/ServicoManager';
import { ConfigManager } from './components/ConfigManager';

import {
  ORGAOS as INITIAL_ORGAOS,
  INITIAL_OPERADORES,
  INITIAL_RESPONSAVEIS,
  INITIAL_SERVICOS
} from './data/mockData';

// 🔥 Firestore (tempo real)
import {
  subscribeGuias,
  saveGuiaFS,
  deleteGuiaFS
} from './services/firestoreService';

// Icons
const IconPlus = () => <svg width="20" height="20"><circle cx="10" cy="10" r="9" stroke="currentColor" fill="none"/><path d="M10 5v10M5 10h10" stroke="currentColor"/></svg>;
const IconList = () => <svg width="20" height="20"><line x1="4" y1="5" x2="16" y2="5" stroke="currentColor"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor"/><line x1="4" y1="15" x2="16" y2="15" stroke="currentColor"/></svg>;

// LOGO
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div
    className={`rounded-full bg-[#004aad] border-2 border-white flex items-center justify-center font-bold text-white
    ${size === 'large' ? 'w-20 h-20' : 'w-10 h-10 text-xs'}`}
  >
    DIGRA
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);

  const [editingGuia, setEditingGuia] = useState<Guia | undefined>();
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);

  // 🔥 FIRESTORE — Guias em tempo real
  useEffect(() => {
    const unsubscribe = subscribeGuias((data) => {
      setGuias(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔒 Mantém cadastros locais por enquanto (não perder nada)
  useEffect(() => {
    const savedOrgaos = localStorage.getItem('digra_orgaos');
    setOrgaos(savedOrgaos ? JSON.parse(savedOrgaos) : INITIAL_ORGAOS);

    const savedOperadores = localStorage.getItem('digra_operadores');
    setOperadores(savedOperadores ? JSON.parse(savedOperadores) : INITIAL_OPERADORES);

    const savedResponsaveis = localStorage.getItem('digra_responsaveis');
    setResponsaveis(savedResponsaveis ? JSON.parse(savedResponsaveis) : INITIAL_RESPONSAVEIS);

    const savedServicos = localStorage.getItem('digra_servicos');
    setServicos(savedServicos ? JSON.parse(savedServicos) : INITIAL_SERVICOS);
  }, []);

  const handleSaveGuia = async (guia: Guia) => {
    await saveGuiaFS(guia);
    setActiveTab('list');
    setEditingGuia(undefined);
  };

  const handleDeleteGuia = async (id: string) => {
    if (window.confirm('Deseja excluir esta guia?')) {
      await deleteGuiaFS(id);
    }
  };

  return (
    <div className="p-10 space-y-6 bg-slate-100 min-h-screen">

      <header className="flex items-center gap-4">
        <LogoDigra />
        <h1 className="text-xl font-bold">GUIAS DE REMESSA</h1>
      </header>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('form')}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <IconPlus /> Nova Guia
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className="bg-slate-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <IconList /> Histórico
        </button>
      </div>

      {activeTab === 'form' && (
        <GuiaForm
          initialData={editingGuia}
          onSave={handleSaveGuia}
          onCancel={() => setActiveTab('list')}
          onPrint={(g) => setPrintGuia(g)}
          orgaosList={orgaos}
          operadoresList={operadores}
          responsaveisList={responsaveis}
          servicosList={servicos}
          onAddGlobalServico={(s) => setServicos([...servicos, s])}
        />
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold mb-4">Histórico de Guias</h2>

          {guias.length === 0 && <p>Nenhuma guia cadastrada.</p>}

          {guias.map((g) => (
            <div key={g.id} className="flex justify-between border-b py-2">
              <div>
                <strong>{g.numero}</strong> — {g.orgaoSnapshot.sigla}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPrintGuia(g)} className="text-blue-600">Imprimir</button>
                <button onClick={() => setEditingGuia(g)} className="text-indigo-600">Editar</button>
                <button onClick={() => handleDeleteGuia(g.id)} className="text-red-600">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {printGuia && (
        <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />
      )}

      <footer className="text-xs text-slate-500 mt-10">
        ⚡ Alexandre | DIGRA Apps
      </footer>
    </div>
  );
}

export default App;
