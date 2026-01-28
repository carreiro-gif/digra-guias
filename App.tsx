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

const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3v10M10 13l-4-4M10 13l4-4M3 17h14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconFilter = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 4h14M5 10h10M8 16h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// LOGO (ajuste: centragem perfeita + contorno branco levemente mais grosso)
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-[#004aad] border-white font-bold text-white leading-none ${
      size === 'large' ? 'w-20 h-20' : 'w-10 h-10 text-xs'
    } border-[3px]`}
  >
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
  
  // 🔍 Estados de busca e filtros avançados
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOrgao, setFilterOrgao] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

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

  /* ============================
     🔍 BUSCA AVANÇADA E FILTROS
  ============================ */
  const filteredGuias = guias.filter(g => {
    // Busca por texto (número, órgão, solicitante, observações)
    const matchesSearch = 
      g.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.orgaoSnapshot?.sigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.orgaoSnapshot?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por órgão
    const matchesOrgao = !filterOrgao || g.orgaoSnapshot?.id === filterOrgao;

    // Filtro por data
    let matchesData = true;
    if (filterDataInicio || filterDataFim) {
      const guiaDate = new Date(g.dataEmissao);
      if (filterDataInicio) {
        const dataInicio = new Date(filterDataInicio);
        matchesData = matchesData && guiaDate >= dataInicio;
      }
      if (filterDataFim) {
        const dataFim = new Date(filterDataFim);
        dataFim.setHours(23, 59, 59); // Incluir todo o dia
        matchesData = matchesData && guiaDate <= dataFim;
      }
    }

    return matchesSearch && matchesOrgao && matchesData;
  });

  /* ============================
     📥 EXPORTAR DADOS (BACKUP)
  ============================ */
  const handleExportarDados = () => {
    const dados = {
      guias: guias,
      orgaos: orgaos,
      operadores: operadores,
      responsaveis: responsaveis,
      servicos: servicos,
      exportadoEm: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digra-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ Backup exportado com sucesso!');
  };

  const handleExportarGuiasCSV = () => {
    // Criar CSV das guias
    const headers = ['Número', 'Data', 'Órgão', 'Solicitante', 'Observações'];
    const rows = filteredGuias.map(g => [
      g.numero,
      new Date(g.dataEmissao).toLocaleDateString('pt-BR'),
      `${g.orgaoSnapshot.nome} (${g.orgaoSnapshot.sigla})`,
      g.solicitante || '',
      g.observacoes || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digra-guias-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ Guias exportadas para CSV!');
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setFilterOrgao('');
    setFilterDataInicio('');
    setFilterDataFim('');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center">
          <LogoDigra />
          <h1 className="text-xs mt-3 tracking-widest text-center">GUIAS DE REMESSA</h1>
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
      <main className="flex-1 p-6 overflow-auto pb-16">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Histórico de Guias</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExportarGuiasCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  title="Exportar guias visíveis para CSV"
                >
                  <IconDownload />
                  CSV
                </button>
                <button
                  onClick={handleExportarDados}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  title="Backup completo (JSON)"
                >
                  <IconDownload />
                  Backup
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                    showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
                  }`}
                >
                  <IconFilter />
                  Filtros
                </button>
              </div>
            </div>

            {/* Busca Básica */}
            <input
              className="border p-2 mb-4 w-full rounded"
              placeholder="Buscar por número, órgão, solicitante ou observações..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Filtros Avançados */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="font-bold mb-3 text-sm">Filtros Avançados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Órgão</label>
                    <select
                      className="border p-2 w-full rounded text-sm"
                      value={filterOrgao}
                      onChange={e => setFilterOrgao(e.target.value)}
                    >
                      <option value="">Todos os órgãos</option>
                      {orgaos.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.sigla} - {o.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Início</label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded text-sm"
                      value={filterDataInicio}
                      onChange={e => setFilterDataInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Fim</label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded text-sm"
                      value={filterDataFim}
                      onChange={e => setFilterDataFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={limparFiltros}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}

            {/* Contador de resultados */}
            <div className="text-sm text-gray-600 mb-2">
              {filteredGuias.length} {filteredGuias.length === 1 ? 'guia encontrada' : 'guias encontradas'}
            </div>

            {/* Lista de Guias */}
            {filteredGuias.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                Nenhuma guia encontrada com os filtros aplicados
              </div>
            ) : (
              filteredGuias.map(g => (
                <div key={g.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
                  <div>
                    <div>
                      <strong>{g.numero}</strong> — {g.orgaoSnapshot.sigla}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(g.dataEmissao).toLocaleDateString('pt-BR')}
                      {g.solicitante && ` • ${g.solicitante}`}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setPrintGuia(g)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Imprimir
                    </button>
                    <button 
                      onClick={() => { setEditingGuia(g); setActiveTab('form'); }}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteGuia(g.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
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

      {/* RODAPÉ FIXO */}
      <footer className="fixed bottom-0 right-0 left-0 md:left-64 bg-slate-800 text-slate-400 text-xs py-1.5 px-4 text-center border-t border-slate-700 z-10">
        ⚡ Alexandre | DIGRA Apps
      </footer>

      {printGuia && <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />}
    </div>
  );
}

export default App;
