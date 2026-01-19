import React, { useState, useEffect } from 'react';
import { Guia, Orgao, Operador, ResponsavelExterno, ServicoPreco } from './types';
import { GuiaForm } from './components/GuiaForm';
import { GuiaPrint } from './components/GuiaPrint';
import { OrgaoManager } from './components/OrgaoManager';
import { OperadorManager } from './components/OperadorManager';
import { ResponsavelManager } from './components/ResponsavelManager';
import { ServicoManager } from './components/ServicoManager';
import { ConfigManager } from './components/ConfigManager';
import { ORGAOS as INITIAL_ORGAOS, INITIAL_OPERADORES, INITIAL_RESPONSAVEIS, INITIAL_SERVICOS } from './data/mockData';

// Icons using SVG to avoid external deps
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconBuilding = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconTruck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><line x1="16" y1="8" x2="20" y2="8"/><line x1="16" y1="16" x2="23" y2="16"/><path d="M16 12h7"/></svg>;
const IconPrinter = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const IconTags = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const IconHash = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;

// CSS-based logo component to match the provided image (Blue circle, white border, DIGRA text)
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div 
    className={`
      rounded-full bg-[#004aad] border-2 border-white 
      flex items-center justify-center font-bold text-white tracking-widest
      shadow-md ring-2 ring-[#004aad]
      ${size === 'large' ? 'w-20 h-20 text-lg' : 'w-10 h-10 text-[9px]'}
    `}
  >
    DIGRA
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'orgaos' | 'operadores' | 'externos' | 'servicos' | 'config'>('list');
  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);
  
  // Próxima sequência configurada manualmente
  const [nextSequence, setNextSequence] = useState<number>(1);

  const [editingGuia, setEditingGuia] = useState<Partial<Guia> | undefined>(undefined);
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const savedGuias = localStorage.getItem('digra_guias');
    if (savedGuias) setGuias(JSON.parse(savedGuias));

    const savedOrgaos = localStorage.getItem('digra_orgaos');
    setOrgaos(savedOrgaos ? JSON.parse(savedOrgaos) : INITIAL_ORGAOS);

    const savedOperadores = localStorage.getItem('digra_operadores');
    setOperadores(savedOperadores ? JSON.parse(savedOperadores) : INITIAL_OPERADORES);

    const savedResponsaveis = localStorage.getItem('digra_responsaveis');
    setResponsaveis(savedResponsaveis ? JSON.parse(savedResponsaveis) : INITIAL_RESPONSAVEIS);

    const savedServicos = localStorage.getItem('digra_servicos');
    setServicos(savedServicos ? JSON.parse(savedServicos) : INITIAL_SERVICOS);

    const savedSeq = localStorage.getItem('digra_next_sequence');
    if (savedSeq) setNextSequence(parseInt(savedSeq, 10));
  }, []);

  // Save to local storage effects
  useEffect(() => localStorage.setItem('digra_guias', JSON.stringify(guias)), [guias]);
  useEffect(() => { if (orgaos.length) localStorage.setItem('digra_orgaos', JSON.stringify(orgaos)); }, [orgaos]);
  useEffect(() => { if (operadores.length) localStorage.setItem('digra_operadores', JSON.stringify(operadores)); }, [operadores]);
  useEffect(() => { if (responsaveis.length) localStorage.setItem('digra_responsaveis', JSON.stringify(responsaveis)); }, [responsaveis]);
  useEffect(() => { if (servicos.length) localStorage.setItem('digra_servicos', JSON.stringify(servicos)); }, [servicos]);
  useEffect(() => { localStorage.setItem('digra_next_sequence', nextSequence.toString()); }, [nextSequence]);

  const getNextGuiaNumber = () => {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `${currentYear}/`;
    
    // Filtra guias do ano atual
    const yearGuias = guias.filter(g => g.numero.startsWith(yearPrefix));
    
    // Extrai a maior sequência existente
    const maxSeqInGuias = yearGuias.reduce((max, g) => {
      const parts = g.numero.split('/');
      if (parts.length === 2) {
        const seq = parseInt(parts[1], 10);
        return seq > max ? seq : max;
      }
      return max;
    }, 0);

    // Usa o maior valor entre o automático (+1) e o floor manual configurado
    const finalSeq = Math.max(maxSeqInGuias + 1, nextSequence);

    return `${yearPrefix}${finalSeq.toString().padStart(4, '0')}`;
  };

  const handleSaveGuia = (guia: Guia) => {
    const exists = guias.find(g => g.id === guia.id);
    if (exists) {
      setGuias(guias.map(g => g.id === guia.id ? guia : g));
    } else {
      setGuias([guia, ...guias]);
    }
    setActiveTab('list');
    setEditingGuia(undefined);
  };

  const handleDeleteGuia = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta guia?')) {
      setGuias(guias.filter(g => g.id !== id));
    }
  };

  // Generic Save Handlers
  const handleSaveOrgao = (item: Orgao) => {
    const exists = orgaos.find(o => o.id === item.id);
    setOrgaos(exists ? orgaos.map(o => o.id === item.id ? item : o) : [...orgaos, item]);
  };
  const handleDeleteOrgao = (id: string) => setOrgaos(orgaos.filter(o => o.id !== id));

  const handleSaveOperador = (item: Operador) => {
    const exists = operadores.find(o => o.id === item.id);
    setOperadores(exists ? operadores.map(o => o.id === item.id ? item : o) : [...operadores, item]);
  };
  const handleDeleteOperador = (id: string) => setOperadores(operadores.filter(o => o.id !== id));

  const handleSaveResponsavel = (item: ResponsavelExterno) => {
    const exists = responsaveis.find(o => o.id === item.id);
    setResponsaveis(exists ? responsaveis.map(o => o.id === item.id ? item : o) : [...responsaveis, item]);
  };
  const handleDeleteResponsavel = (id: string) => setResponsaveis(responsaveis.filter(o => o.id !== id));

  const handleSaveServico = (item: ServicoPreco) => {
    const exists = servicos.find(o => o.id === item.id);
    setServicos(exists ? servicos.map(o => o.id === item.id ? item : o) : [...servicos, item]);
  };
  const handleDeleteServico = (id: string) => setServicos(servicos.filter(o => o.id !== id));


  const filteredGuias = guias.filter(g => 
    g.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.orgaoSnapshot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.orgaoSnapshot.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar - No Print */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex no-print flex-shrink-0">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center text-center">
          <LogoDigra size="large" />
          <h1 className="text-sm font-bold tracking-widest mt-4 uppercase text-slate-200">GUIAS DE REMESSA</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('form'); setEditingGuia(undefined); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <IconPlus /> Nova Guia
          </button>
          
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <IconList /> Histórico
          </button>

          <div className="pt-4 border-t border-slate-700 mt-4">
            <p className="text-xs text-slate-500 uppercase px-4 mb-2 font-bold">Cadastros</p>
            
            <button 
              onClick={() => setActiveTab('orgaos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'orgaos' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <IconBuilding /> Órgãos
            </button>

            <button 
              onClick={() => setActiveTab('servicos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'servicos' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <IconTags /> Serviços
            </button>

            <button 
              onClick={() => setActiveTab('operadores')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'operadores' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <IconUsers /> Operadores
            </button>

            <button 
              onClick={() => setActiveTab('externos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'externos' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <IconTruck /> Externos
            </button>

            <button 
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <IconHash /> Numeração
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center no-print flex-shrink-0">
           <div className="flex items-center gap-3">
             <LogoDigra size="small" />
             <h1 className="font-bold text-xs uppercase">GUIAS DE REMESSA</h1>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setActiveTab('list')} className="p-2"><IconList/></button>
             <button onClick={() => setActiveTab('form')} className="p-2"><IconPlus/></button>
           </div>
        </div>

        <main className="flex-1 overflow-auto relative p-6 md:p-10 scroll-smooth pb-16">
          
          <div className="max-w-6xl mx-auto">
            {activeTab === 'form' && (
              <div className="animate-fade-in">
                <GuiaForm 
                  initialData={editingGuia} 
                  suggestedNumber={getNextGuiaNumber()}
                  onSave={handleSaveGuia} 
                  onCancel={() => setActiveTab('list')}
                  onPrint={(guia) => setPrintGuia(guia)}
                  onAddGlobalServico={handleSaveServico}
                  orgaosList={orgaos}
                  operadoresList={operadores}
                  responsaveisList={responsaveis}
                  servicosList={servicos}
                />
              </div>
            )}

            {activeTab === 'orgaos' && (
              <div className="animate-fade-in">
                <OrgaoManager 
                  orgaos={orgaos}
                  onSave={handleSaveOrgao}
                  onDelete={handleDeleteOrgao}
                />
              </div>
            )}

            {activeTab === 'servicos' && (
              <div className="animate-fade-in">
                <ServicoManager 
                  servicos={servicos}
                  onSave={handleSaveServico}
                  onDelete={handleDeleteServico}
                />
              </div>
            )}

            {activeTab === 'operadores' && (
              <div className="animate-fade-in">
                <OperadorManager 
                  operadores={operadores}
                  onSave={handleSaveOperador}
                  onDelete={handleDeleteOperador}
                />
              </div>
            )}

            {activeTab === 'externos' && (
              <div className="animate-fade-in">
                <ResponsavelManager 
                  responsaveis={responsaveis}
                  onSave={handleSaveResponsavel}
                  onDelete={handleDeleteResponsavel}
                />
              </div>
            )}

            {activeTab === 'config' && (
              <div className="animate-fade-in">
                <ConfigManager 
                  currentNextSequence={nextSequence}
                  onSave={setNextSequence}
                />
              </div>
            )}

            {activeTab === 'list' && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Histórico de Guias</h2>
                    <div className="text-sm text-slate-500">Total: {filteredGuias.length}</div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <input 
                      type="text"
                      placeholder="Buscar por Número, Órgão ou Sigla..."
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Número</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Órgão</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Itens</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredGuias.map(guia => (
                        <tr key={guia.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{guia.numero}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(guia.dataEmissao).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {guia.orgaoSnapshot.sigla} 
                            <span className="block text-xs text-slate-400">{guia.orgaoSnapshot.comarca}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {guia.itens.length} itens
                            <div className="text-xs text-slate-400 truncate w-40">
                              {guia.itens.map(i => i.descricao).join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => setPrintGuia(guia)}
                              className="bg-slate-800 text-white hover:bg-slate-700 px-3 py-1.5 rounded inline-flex items-center gap-1 text-xs font-bold mr-2 shadow-sm transition-colors"
                              title="Imprimir Guia A5"
                            >
                              <IconPrinter /> Imprimir
                            </button>
                            <button 
                              onClick={() => { setEditingGuia(guia); setActiveTab('form'); }}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 font-semibold"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteGuia(guia.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredGuias.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            Nenhuma guia encontrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Fixed Footer - No Print */}
        <footer className="no-print bg-slate-100 border-t border-slate-200 py-2 text-center text-xs text-slate-500 font-medium flex-shrink-0 z-10">
          ⚡ Alexandre | DIGRA Apps
        </footer>
      </div>

      {/* Print Modal Overlay */}
      {printGuia && (
        <GuiaPrint 
          guia={printGuia} 
          onClose={() => setPrintGuia(null)} 
        />
      )}

    </div>
  );
}

export default App;