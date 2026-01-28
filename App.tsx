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

// 🔥 FIRESTORE - Importando TODAS as funções
import {
  salvarGuia,
  ouvirGuias,
  excluirGuia,
  salvarOrgao,
  ouvirOrgaos,
  excluirOrgao,
  salvarOperador,
  ouvirOperadores,
  excluirOperador,
  salvarResponsavel,
  ouvirResponsaveis,
  excluirResponsavel,
  salvarServico,
  ouvirServicos,
  excluirServico
} from './services/firestoreService';

// ÍCONES SVG
const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="4" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="2"/>
    <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="4" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="2" width="12" height="16" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="7" y="5" width="2" height="2" fill="currentColor"/>
    <rect x="11" y="5" width="2" height="2" fill="currentColor"/>
    <rect x="7" y="9" width="2" height="2" fill="currentColor"/>
    <rect x="11" y="9" width="2" height="2" fill="currentColor"/>
    <rect x="7" y="13" width="2" height="4" fill="currentColor"/>
    <rect x="11" y="13" width="2" height="4" fill="currentColor"/>
  </svg>
);

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 10L10 3L17 10L10 17L3 10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 16c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M18 16c0-1.5-1-3-3-3" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const IconUserCheck = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 16c0-2.5 2-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M14 8l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const IconHash = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7 3L5 17M15 3L13 17M3 7h14M2 13h14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// LOGO
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div className={`rounded-full bg-[#004aad] border-2 border-white flex items-center justify-center font-bold text-white ${size === 'large' ? 'w-20 h-20' : 'w-10 h-10 text-xs'}`}>
    DIGRA
  </div>
);

function App() {
  const [activeTab, setActiveTab] =
    useState<'list' | 'form' | 'orgaos' | 'operadores' | 'externos' | 'servicos' | 'config'>('list');

  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);
  const [nextSequence, setNextSequence] = useState<number>(1);

  const [editingGuia, setEditingGuia] = useState<Guia | undefined>();
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [dadosCarregados, setDadosCarregados] = useState(false);

  /* ============================
     🔥 FIREBASE — GUIAS (REALTIME)
  ============================ */
  useEffect(() => {
    const unsubscribe = ouvirGuias((data) => {
      const saneadas = data.filter(
        (g) => g && g.orgaoSnapshot && g.orgaoSnapshot.sigla
      );
      setGuias(saneadas as Guia[]);
    });

    return () => unsubscribe();
  }, []);

  /* ============================
     🔥 FIREBASE — ÓRGÃOS (REALTIME)
  ============================ */
  useEffect(() => {
    const unsubscribe = ouvirOrgaos((data) => {
      setOrgaos(data as Orgao[]);
      setDadosCarregados(true);
    });

    return () => unsubscribe();
  }, []);

  /* ============================
     🔥 FIREBASE — OPERADORES (REALTIME)
  ============================ */
  useEffect(() => {
    const unsubscribe = ouvirOperadores((data) => {
      setOperadores(data as Operador[]);
    });

    return () => unsubscribe();
  }, []);

  /* ============================
     🔥 FIREBASE — RESPONSÁVEIS (REALTIME)
  ============================ */
  useEffect(() => {
    const unsubscribe = ouvirResponsaveis((data) => {
      setResponsaveis(data as ResponsavelExterno[]);
    });

    return () => unsubscribe();
  }, []);

  /* ============================
     🔥 FIREBASE — SERVIÇOS (REALTIME)
  ============================ */
  useEffect(() => {
    const unsubscribe = ouvirServicos((data) => {
      setServicos(data as ServicoPreco[]);
    });

    return () => unsubscribe();
  }, []);

  /* ============================
     🔒 NUMERAÇÃO (AINDA NO LOCALSTORAGE)
  ============================ */
  useEffect(() => {
    const seq = localStorage.getItem('digra_next_sequence');
    if (seq) setNextSequence(Number(seq));
  }, []);

  useEffect(() => {
    localStorage.setItem('digra_next_sequence', nextSequence.toString());
  }, [nextSequence]);

  /* ============================
     🚀 MIGRAÇÃO AUTOMÁTICA
     Se o Firebase estiver vazio, importa do localStorage
  ============================ */
  useEffect(() => {
    if (!dadosCarregados) return;

    // Se Firebase está vazio, importa do localStorage
    if (orgaos.length === 0) {
      const orgaosLocal = JSON.parse(localStorage.getItem('digra_orgaos') || 'null') || INITIAL_ORGAOS;
      orgaosLocal.forEach((o: Orgao) => salvarOrgao(o));
    }

    if (operadores.length === 0) {
      const operadoresLocal = JSON.parse(localStorage.getItem('digra_operadores') || 'null') || INITIAL_OPERADORES;
      operadoresLocal.forEach((o: Operador) => salvarOperador(o));
    }

    if (responsaveis.length === 0) {
      const responsaveisLocal = JSON.parse(localStorage.getItem('digra_responsaveis') || 'null') || INITIAL_RESPONSAVEIS;
      responsaveisLocal.forEach((r: ResponsavelExterno) => salvarResponsavel(r));
    }

    if (servicos.length === 0) {
      const servicosLocal = JSON.parse(localStorage.getItem('digra_servicos') || 'null') || INITIAL_SERVICOS;
      servicosLocal.forEach((s: ServicoPreco) => salvarServico(s));
    }
  }, [dadosCarregados]);

  /* ============================
     🔧 GUIAS
  ============================ */
  const getNextGuiaNumber = () => {
    const year = new Date().getFullYear();
    const seq = Math.max(
      ...guias
        .filter(g => g.numero.startsWith(`${year}/`))
        .map(g => Number(g.numero.split('/')[1] || 0)),
      nextSequence
    ) + 1;

    return `${year}/${seq.toString().padStart(4, '0')}`;
  };

  const handleSaveGuia = async (guia: Guia) => {
    await salvarGuia(guia);
    setActiveTab('list');
    setEditingGuia(undefined);
  };

  const handleDeleteGuia = async (id: string) => {
    if (window.confirm('Deseja excluir esta guia?')) {
      await excluirGuia(id);
    }
  };

  /* ============================
     🔧 ÓRGÃOS
  ============================ */
  const handleSaveOrgao = async (orgao: Orgao) => {
    await salvarOrgao(orgao);
  };

  const handleDeleteOrgao = async (id: string) => {
    if (window.confirm('Deseja excluir este órgão?')) {
      await excluirOrgao(id);
    }
  };

  /* ============================
     🔧 OPERADORES
  ============================ */
  const handleSaveOperador = async (operador: Operador) => {
    await salvarOperador(operador);
  };

  const handleDeleteOperador = async (id: string) => {
    if (window.confirm('Deseja excluir este operador?')) {
      await excluirOperador(id);
    }
  };

  /* ============================
     🔧 RESPONSÁVEIS
  ============================ */
  const handleSaveResponsavel = async (responsavel: ResponsavelExterno) => {
    await salvarResponsavel(responsavel);
  };

  const handleDeleteResponsavel = async (id: string) => {
    if (window.confirm('Deseja excluir este responsável?')) {
      await excluirResponsavel(id);
    }
  };

  /* ============================
     🔧 SERVIÇOS
  ============================ */
  const handleSaveServico = async (servico: ServicoPreco) => {
    await salvarServico(servico);
  };

  const handleDeleteServico = async (id: string) => {
    if (window.confirm('Deseja excluir este serviço?')) {
      await excluirServico(id);
    }
  };

  const filteredGuias = guias.filter(g =>
    g.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.orgaoSnapshot?.sigla?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 text-center border-b border-slate-700">
          <LogoDigra />
          <h1 className="text-xs mt-3 tracking-widest">GUIAS DE REMESSA</h1>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          {/* Nova Guia */}
          <button
            onClick={() => setActiveTab("form")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'form' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconPlus />
            <span>Nova Guia</span>
          </button>

          {/* Histórico */}
          <button
            onClick={() => setActiveTab("list")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconList />
            <span>Histórico</span>
          </button>

          <hr className="my-2 border-slate-700" />
          
          <div className="text-xs text-slate-500 uppercase tracking-wider px-4 py-2">
            Cadastros
          </div>

          {/* Órgãos */}
          <button
            onClick={() => setActiveTab("orgaos")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'orgaos' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconBuilding />
            <span>Órgãos</span>
          </button>

          {/* Serviços */}
          <button
            onClick={() => setActiveTab("servicos")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'servicos' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconTag />
            <span>Serviços</span>
          </button>

          {/* Operadores */}
          <button
            onClick={() => setActiveTab("operadores")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'operadores' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconUsers />
            <span>Operadores</span>
          </button>

          {/* Externos */}
          <button
            onClick={() => setActiveTab("externos")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'externos' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconUserCheck />
            <span>Externos</span>
          </button>

          {/* Numeração */}
          <button
            onClick={() => setActiveTab("config")}
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'config' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <IconHash />
            <span>Numeração</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === 'form' && (
          <GuiaForm
            initialData={editingGuia}
            suggestedNumber={getNextGuiaNumber()}
            onSave={handleSaveGuia}
            onCancel={() => setActiveTab('list')}
            onPrint={setPrintGuia}
            orgaosList={orgaos}
            operadoresList={operadores}
            responsaveisList={responsaveis}
            servicosList={servicos}
            onAddGlobalServico={handleSaveServico}
          />
        )}

        {activeTab === 'list' && (
          <>
            <h2 className="text-xl font-bold mb-4">Histórico de Guias</h2>
            <input
              className="border p-2 mb-4 w-full"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {filteredGuias.map(g => (
              <div key={g.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between">
                <div>
                  <strong>{g.numero}</strong> — {g.orgaoSnapshot.sigla}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPrintGuia(g)}>Imprimir</button>
                  <button onClick={() => { setEditingGuia(g); setActiveTab('form'); }}>Editar</button>
                  <button onClick={() => handleDeleteGuia(g.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'orgaos' && (
          <OrgaoManager 
            orgaos={orgaos} 
            onSave={handleSaveOrgao} 
            onDelete={handleDeleteOrgao} 
          />
        )}

        {activeTab === 'servicos' && (
          <ServicoManager 
            servicos={servicos} 
            onSave={handleSaveServico} 
            onDelete={handleDeleteServico} 
          />
        )}

        {activeTab === 'operadores' && (
          <OperadorManager 
            operadores={operadores} 
            onSave={handleSaveOperador} 
            onDelete={handleDeleteOperador} 
          />
        )}

        {activeTab === 'externos' && (
          <ResponsavelManager 
            responsaveis={responsaveis} 
            onSave={handleSaveResponsavel} 
            onDelete={handleDeleteResponsavel} 
          />
        )}

        {activeTab === 'config' && (
          <ConfigManager 
            currentNextSequence={nextSequence} 
            onSave={setNextSequence} 
          />
        )}
      </main>

      {printGuia && <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />}
    </div>
  );
}

export default App;
