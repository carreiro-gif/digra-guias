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

// 🔥 FIRESTORE (NOMES REAIS DO SEU SERVICE)
import {
  salvarGuia,
  ouvirGuias,
  excluirGuia
} from './services/firestoreService';

// ICONS (mantidos)
const IconPlus = () => <svg width="20" height="20"><circle cx="10" cy="10" r="9" stroke="currentColor" fill="none"/><path d="M10 5v10M5 10h10" stroke="currentColor"/></svg>;
const IconList = () => <svg width="20" height="20"><line x1="4" y1="5" x2="16" y2="5" stroke="currentColor"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor"/><line x1="4" y1="15" x2="16" y2="15" stroke="currentColor"/></svg>;

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
     🔒 CADASTROS LOCAIS
  ============================ */
  useEffect(() => {
    setOrgaos(JSON.parse(localStorage.getItem('digra_orgaos') || 'null') || INITIAL_ORGAOS);
    setOperadores(JSON.parse(localStorage.getItem('digra_operadores') || 'null') || INITIAL_OPERADORES);
    setResponsaveis(JSON.parse(localStorage.getItem('digra_responsaveis') || 'null') || INITIAL_RESPONSAVEIS);
    setServicos(JSON.parse(localStorage.getItem('digra_servicos') || 'null') || INITIAL_SERVICOS);
    const seq = localStorage.getItem('digra_next_sequence');
    if (seq) setNextSequence(Number(seq));
  }, []);

  useEffect(() => localStorage.setItem('digra_orgaos', JSON.stringify(orgaos)), [orgaos]);
  useEffect(() => localStorage.setItem('digra_operadores', JSON.stringify(operadores)), [operadores]);
  useEffect(() => localStorage.setItem('digra_responsaveis', JSON.stringify(responsaveis)), [responsaveis]);
  useEffect(() => localStorage.setItem('digra_servicos', JSON.stringify(servicos)), [servicos]);
  useEffect(() => localStorage.setItem('digra_next_sequence', nextSequence.toString()), [nextSequence]);

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

        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('form')} className="w-full px-4 py-2 bg-blue-600 rounded">Nova Guia</button>
          <button onClick={() => setActiveTab('list')} className="w-full px-4 py-2 bg-slate-700 rounded">Histórico</button>
          <hr className="border-slate-700 my-3" />
          <button onClick={() => setActiveTab('orgaos')}>Órgãos</button>
          <button onClick={() => setActiveTab('servicos')}>Serviços</button>
          <button onClick={() => setActiveTab('operadores')}>Operadores</button>
          <button onClick={() => setActiveTab('externos')}>Externos</button>
          <button onClick={() => setActiveTab('config')}>Numeração</button>
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
            onAddGlobalServico={(s) => setServicos([...servicos, s])}
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

        {activeTab === 'orgaos' && <OrgaoManager orgaos={orgaos} onSave={o => setOrgaos([...orgaos, o])} onDelete={id => setOrgaos(orgaos.filter(o => o.id !== id))} />}
        {activeTab === 'servicos' && <ServicoManager servicos={servicos} onSave={s => setServicos([...servicos, s])} onDelete={id => setServicos(servicos.filter(s => s.id !== id))} />}
        {activeTab === 'operadores' && <OperadorManager operadores={operadores} onSave={o => setOperadores([...operadores, o])} onDelete={id => setOperadores(operadores.filter(o => o.id !== id))} />}
        {activeTab === 'externos' && <ResponsavelManager responsaveis={responsaveis} onSave={r => setResponsaveis([...responsaveis, r])} onDelete={id => setResponsaveis(responsaveis.filter(r => r.id !== id))} />}
        {activeTab === 'config' && <ConfigManager currentNextSequence={nextSequence} onSave={setNextSequence} />}
      </main>

      {printGuia && <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />}
    </div>
  );
}

export default App;
