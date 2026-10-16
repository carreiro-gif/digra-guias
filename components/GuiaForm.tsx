import React, { useState, useEffect, useRef } from 'react';
import { Orgao, ItemGuia, ServicoPreco, StatusServico, Guia, Operador, ResponsavelExterno } from '../types';

// ===========================
// 🎨 SUBTIPOS POR SERVIÇO
// ===========================
const SUBTIPOS_SERVICO: Record<string, string[]> = {
  'CARTAZ':               ['A3', 'A4', 'Outro'],
  'FOLDER':               ['A3', 'A4', 'Outro'],
  'CRACHÁ':               ['Normal', 'Plastificado', 'Outro'],
  'PLACA DE SINALIZAÇÃO': ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA EXTERNA':        ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA INTERNA':        ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA ESPECIAL':       ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA INFORMATIVA':    ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA INDICATIVA':     ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'PLACA DE PAVIMENTO':   ['Plastificada', 'Vinil', 'Alumínio', 'Adesivada', 'Outro'],
  'ADESIVO':              ['Simples', 'Resinado', 'Vinil', 'Outro'],
  'ETIQUETA':             ['Simples', 'Adesiva', 'Plastificada', 'Outro'],
  'FAIXA':                ['Vinil', 'Tecido', 'Outro'],
  'PAINEL':               ['Lona', 'MDF', 'Outro'],
};

const getSubtiposDoServico = (descricao: string): string[] | null => {
  if (!descricao) return null;
  const upper = descricao.toUpperCase().trim();
  const key = Object.keys(SUBTIPOS_SERVICO).find(k => upper === k.toUpperCase());
  return key ? SUBTIPOS_SERVICO[key] : null;
};

// ===========================
// 💾 AUTOCOMPLETE SOLICITANTE
// ===========================
const LS_SOLICITANTES = 'digra_solicitantes_conhecidos';

const getSolicitantesConhecidos = (): string[] => {
  try { return JSON.parse(localStorage.getItem(LS_SOLICITANTES) || '[]'); }
  catch { return []; }
};

const salvarSolicitanteLS = (nome: string) => {
  if (!nome.trim()) return;
  const lista = getSolicitantesConhecidos();
  if (!lista.map(n => n.toLowerCase()).includes(nome.trim().toLowerCase())) {
    localStorage.setItem(LS_SOLICITANTES, JSON.stringify([...lista, nome.trim()].sort()));
  }
};

// ===========================
// TIPOS
// ===========================
interface ItemExtras {
  selectedSubtype: string;
  customSubtype: string;
  tamanho: string;
}

interface GuiaFormProps {
  initialData?: Partial<Guia>;
  onSave: (guia: Guia) => void;
  onCancel: () => void;
  onPrint: (guia: Guia) => void;
  onAddGlobalServico?: (servico: ServicoPreco) => void;
  suggestedNumber?: string;
  orgaosList: Orgao[];
  operadoresList: Operador[];
  responsaveisList: ResponsavelExterno[];
  servicosList: ServicoPreco[];
}

export const GuiaForm: React.FC<GuiaFormProps> = ({
  initialData, onSave, onCancel, onPrint, onAddGlobalServico,
  suggestedNumber, orgaosList, operadoresList, responsaveisList, servicosList
}) => {
  const [selectedOrgaoId, setSelectedOrgaoId] = useState<string>(initialData?.orgaoId || '');
  const [solicitante, setSolicitante] = useState(initialData?.solicitante || '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const currentYear = new Date().getFullYear().toString();
  const [processoAtivo, setProcessoAtivo] = useState<boolean>(initialData?.processoAtivo || false);
  const [numeroProcesso, setNumeroProcesso] = useState<string>(initialData?.numeroProcesso || currentYear);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'Programacao' | 'Sinalizacao' | 'Impressao'>('Programacao');
  const [newServicePrice, setNewServicePrice] = useState(0);

  const [items, setItems] = useState<ItemGuia[]>(() => {
    if (initialData?.itens && initialData.itens.length > 0) return initialData.itens;
    return [{ id: Math.random().toString(36).substr(2, 9), servicoId: '', descricao: '', detalhes: '', quantidade: 1, valorUnitario: 0, status: StatusServico.CONCLUIDO }];
  });

  const [itemExtras, setItemExtras] = useState<Record<string, ItemExtras>>({});
  const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>(initialData?.responsaveisExternos || []);
  const [numeroGuia, setNumeroGuia] = useState<string>(initialData?.numero || suggestedNumber || '');
  const [orgSearch, setOrgSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const solicitanteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (solicitanteRef.current && !solicitanteRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (initialData?.orgaoId) {
      const org = orgaosList.find(o => o.id === initialData.orgaoId);
      if (org) setOrgSearch(org.nome);
    }
  }, [initialData, orgaosList]);

  const getExtras = (itemId: string): ItemExtras =>
    itemExtras[itemId] || { selectedSubtype: '', customSubtype: '', tamanho: '' };

  const updateExtras = (itemId: string, patch: Partial<ItemExtras>) =>
    setItemExtras(prev => ({ ...prev, [itemId]: { ...getExtras(itemId), ...patch } }));

  const getFinalSubtype = (extras: ItemExtras): string =>
    extras.selectedSubtype === 'Outro' ? extras.customSubtype : extras.selectedSubtype;

  const buildDescricao = (item: ItemGuia): string => {
    const extras = getExtras(item.id);
    const subtype = getFinalSubtype(extras);
    return [item.descricao, subtype, extras.tamanho].filter(Boolean).join(' - ');
  };

  const handleSolicitanteChange = (value: string) => {
    setSolicitante(value);
    if (value.length >= 2) {
      const f = getSolicitantesConhecidos().filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(f);
      setShowSuggestions(f.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), servicoId: '', descricao: '', detalhes: '', quantidade: 1, valorUnitario: 0, status: StatusServico.CONCLUIDO }]);
  };

  const updateItem = (index: number, field: keyof ItemGuia, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'servicoId') {
      const s = servicosList.find(serv => serv.id === value);
      newItems[index].descricao = s ? s.descricao : '';
      newItems[index].valorUnitario = s ? s.valorUnitario : 0;
      updateExtras(newItems[index].id, { selectedSubtype: '', customSubtype: '', tamanho: '' });
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const itemId = items[index].id;
    setItems(items.filter((_, i) => i !== index));
    setItemExtras(prev => { const next = { ...prev }; delete next[itemId]; return next; });
  };

  const toggleResponsavel = (nome: string) =>
    setSelectedResponsaveis(prev => prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]);

  const toggleAllResponsaveis = () =>
    setSelectedResponsaveis(selectedResponsaveis.length === responsaveisList.length ? [] : responsaveisList.map(r => r.nome));

  const handleQuickAddService = () => {
    if (!newServiceName) return alert('O nome do serviço é obrigatório.');
    if (onAddGlobalServico) {
      onAddGlobalServico({ id: Math.random().toString(36).substr(2, 9), descricao: newServiceName, categoria: newServiceCategory, valorUnitario: newServicePrice });
      setIsQuickAdding(false); setNewServiceName(''); setNewServicePrice(0);
      alert('Serviço cadastrado com sucesso e já disponível na lista!');
    }
  };

  const constructGuia = (): Guia | null => {
    const orgao = orgaosList.find(o => o.id === selectedOrgaoId);
    if (!orgao) return null;
    return {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      numero: numeroGuia,
      dataEmissao: initialData?.dataEmissao || new Date().toISOString(),
      orgaoId: selectedOrgaoId,
      orgaoSnapshot: orgao,
      itens: items.map(item => ({ ...item, descricao: buildDescricao(item) })),
      observacoes, solicitante, responsaveisExternos: selectedResponsaveis,
      processoAtivo, numeroProcesso: processoAtivo ? numeroProcesso : undefined
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Adicione pelo menos um item');
    const guia = constructGuia();
    if (!guia) return alert('Selecione um órgão válido');
    salvarSolicitanteLS(solicitante);
    onSave(guia);
  };

  const handlePrintClick = () => {
    const guia = constructGuia();
    if (!guia) { alert('Preencha os dados do órgão antes de imprimir.'); return; }
    onPrint(guia);
  };

  const filteredOrgs = orgSearch
    ? orgaosList.filter(o => {
        const t = orgSearch.toLowerCase().trim();
        return o.nome.toLowerCase().includes(t) || o.sigla.toLowerCase().includes(t) ||
          (o.endereco && o.endereco.toLowerCase().includes(t)) ||
          (o.telefone && o.telefone.toLowerCase().includes(t));
      })
    : orgaosList;

  const sortedOperadores = [...operadoresList].sort((a, b) => a.nome.localeCompare(b.nome));
  const sortedServicos = [...servicosList].sort((a, b) => a.descricao.localeCompare(b.descricao));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto relative">

      {/* ── MODAL QUICK ADD ── */}
      {isQuickAdding && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Cadastrar Novo Tipo de Serviço</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Serviço</label>
                <input className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Ex: Diploma" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
                <select className="w-full border border-slate-300 p-2 rounded" value={newServiceCategory}
                  onChange={e => setNewServiceCategory(e.target.value as any)}>
                  <option value="Programacao">Programação</option>
                  <option value="Sinalizacao">Sinalização</option>
                  <option value="Impressao">Impressão</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor Unitário (R$)</label>
                <input type="number" step="0.01" className="w-full border border-slate-300 p-2 rounded"
                  value={newServicePrice} onChange={e => setNewServicePrice(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsQuickAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
              <button type="button" onClick={handleQuickAddService}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-bold">Salvar Serviço</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">{initialData ? 'Editar Guia' : 'Nova Guia de Remessa'}</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handlePrintClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect width="12" height="8" x="6" y="14"/>
            </svg>
            Imprimir Guia
          </button>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase">Nº Guia:</label>
            <input className="bg-white border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-900 w-28 text-center"
              value={numeroGuia} onChange={e => setNumeroGuia(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── ÓRGÃO + SOLICITANTE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Órgão Requisitante</label>
          <input type="text"
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Busque por nome, sigla, endereço ou telefone..."
            value={orgSearch}
            onChange={e => { setOrgSearch(e.target.value); if (selectedOrgaoId) setSelectedOrgaoId(''); }}
          />
          {orgSearch && !selectedOrgaoId && (
            <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-md shadow-xl max-h-64 overflow-auto w-full">
              {filteredOrgs.length > 0 ? filteredOrgs.map(o => (
                <div key={o.id} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
                  onClick={() => { setSelectedOrgaoId(o.id); setOrgSearch(o.nome); }}>
                  <div className="text-sm font-bold text-slate-800">{o.sigla} - {o.nome}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {o.endereco}{o.telefone && <span className="ml-2 text-blue-600 font-medium">Tel: {o.telefone}</span>}
                  </div>
                </div>
              )) : <div className="p-3 text-sm text-slate-500 text-center">Nenhum órgão encontrado.</div>}
            </div>
          )}
        </div>

        <div className="relative" ref={solicitanteRef}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Solicitante</label>
          <input type="text" required autoComplete="off"
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={solicitante}
            onChange={e => handleSolicitanteChange(e.target.value)}
            onFocus={() => {
              if (solicitante.length >= 2) {
                const f = getSolicitantesConhecidos().filter(s => s.toLowerCase().includes(solicitante.toLowerCase()));
                if (f.length > 0) { setSuggestions(f); setShowSuggestions(true); }
              }
            }}
            placeholder="Nome de quem pediu"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-md shadow-xl max-h-48 overflow-auto w-full">
              {suggestions.map((nome, i) => (
                <div key={i} className="p-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0 flex items-center gap-2"
                  onMouseDown={e => { e.preventDefault(); setSolicitante(nome); setShowSuggestions(false); }}>
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="text-blue-400 shrink-0">
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {nome}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PROCESSO ── */}
      <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-sm whitespace-nowrap">
          <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={processoAtivo} onChange={e => setProcessoAtivo(e.target.checked)} />
          ADICIONAR Nº DO PROCESSO
        </label>
        {processoAtivo && (
          <div className="flex items-center gap-2 w-full md:w-auto flex-1">
            <span className="text-sm font-bold text-slate-500">PROCESSO Nº:</span>
            <input type="text" className="flex-1 md:max-w-xs border border-slate-300 rounded p-1.5 text-sm font-bold text-blue-800"
              value={numeroProcesso} onChange={e => setNumeroProcesso(e.target.value)} placeholder="Digite o número do processo" />
          </div>
        )}
      </div>

      {/* ── INFO ÓRGÃO ── */}
      {selectedOrgaoId && (() => {
        const o = orgaosList.find(org => org.id === selectedOrgaoId);
        return o ? (
          <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800 border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p><strong>Comarca:</strong> {o.comarca} | <strong>Fórum:</strong> {o.forum}</p>
                <p><strong>Endereço:</strong> {o.endereco} {o.cep ? `| CEP: ${o.cep}` : ''}</p>
              </div>
              <p className="bg-blue-200 px-2 py-1 rounded font-bold text-blue-900">{o.telefone || 'Sem telefone'}</p>
            </div>
          </div>
        ) : null;
      })()}

      {/* ── ITENS ── */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-700">Itens / Serviços</h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsQuickAdding(true)}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 text-sm flex items-center gap-1 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
              </svg>
              Cadastrar Novo Serviço
            </button>
            <button type="button" onClick={handleAddItem}
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm flex items-center gap-1 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="M12 5v14"/>
              </svg>
              Adicionar Item
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const subtipos = getSubtiposDoServico(item.descricao);
            const extras = getExtras(item.id);
            const showPreview = !!(extras.selectedSubtype || extras.tamanho);

            return (
              <div key={item.id} className="border border-slate-200 p-4 rounded-xl bg-slate-50 relative">
                <button type="button" onClick={() => removeItem(index)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors text-xl leading-none font-bold">×</button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

                  {/* Serviço */}
                  <div className="md:col-span-5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Serviço</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                      value={item.servicoId} onChange={e => updateItem(index, 'servicoId', e.target.value)}>
                      <option value="">Selecione um serviço...</option>
                      {sortedServicos.map(s => <option key={s.id} value={s.id}>{s.descricao}</option>)}
                      <option value="custom">Outro (Personalizado)</option>
                    </select>
                  </div>

                  {/* Qtd */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Qtd</label>
                    <input type="number" min="0"
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      value={item.quantidade}
                      onChange={e => updateItem(index, 'quantidade', parseInt(e.target.value) || 0)} />
                  </div>

                  {/* Tamanho */}
                  <div className="md:col-span-5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                      Tamanho <span className="text-slate-400 normal-case font-normal">(opcional)</span>
                    </label>
                    <input type="text"
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      value={extras.tamanho}
                      onChange={e => updateExtras(item.id, { tamanho: e.target.value })}
                      placeholder="Ex: 30x40cm, A3, 60x90..." />
                  </div>

                  {/* Subtipos */}
                  {subtipos && (
                    <div className="md:col-span-12">
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                        Tipo <span className="text-slate-400 normal-case font-normal">(opcional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {subtipos.map(st => (
                          <button key={st} type="button"
                            onClick={() => {
                              const isSelected = extras.selectedSubtype === st;
                              updateExtras(item.id, { selectedSubtype: isSelected ? '' : st, customSubtype: isSelected ? '' : extras.customSubtype });
                            }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                              extras.selectedSubtype === st
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                            }`}>
                            {st}
                          </button>
                        ))}
                        {extras.selectedSubtype === 'Outro' && (
                          <input type="text" autoFocus
                            className="border-2 border-blue-400 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-40"
                            placeholder="Digite o tipo..."
                            value={extras.customSubtype}
                            onChange={e => updateExtras(item.id, { customSubtype: e.target.value })} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detalhes */}
                  <div className="md:col-span-12">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                      Detalhes <span className="text-slate-400 normal-case font-normal">(Gramatura, Cor, Acabamento - opcional)</span>
                    </label>
                    <input type="text"
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      value={item.detalhes}
                      onChange={e => updateItem(index, 'detalhes', e.target.value)}
                      placeholder="Ex: Papel Couchê 150g, 4x0" />
                  </div>

                  {/* Operadores */}
                  <div className="md:col-span-12">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Operador(es):</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2 border border-slate-200 rounded-lg">
                      {sortedOperadores.map(op => {
                        const isSelected = item.operadores?.includes(op.nome);
                        return (
                          <label key={op.id} className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={!!isSelected}
                              onChange={() => {
                                const current = item.operadores || [];
                                updateItem(index, 'operadores', isSelected ? current.filter(n => n !== op.nome) : [...current, op.nome]);
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-xs text-slate-700">{op.nome}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview */}
                  {showPreview && (
                    <div className="md:col-span-12">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700 flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0">
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <span><strong>Como ficará na guia:</strong> {buildDescricao(item)}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RESPONSÁVEIS EXTERNOS ── */}
      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-slate-700">Serviço Externo Realizado Por:</label>
          <button type="button" onClick={toggleAllResponsaveis} className="text-xs text-blue-600 hover:underline">
            {selectedResponsaveis.length === responsaveisList.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {responsaveisList.map(resp => (
            <label key={resp.id} className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={selectedResponsaveis.includes(resp.nome)} onChange={() => toggleResponsavel(resp.nome)} />
              <span className="text-sm text-slate-700">{resp.nome}</span>
            </label>
          ))}
          {responsaveisList.length === 0 && <span className="text-xs text-slate-500 col-span-3">Nenhum responsável cadastrado.</span>}
        </div>
      </div>

      {/* ── OBSERVAÇÕES ── */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Observações Gerais</label>
        <textarea className="w-full border border-slate-300 rounded-lg p-2 text-sm h-20 focus:ring-2 focus:ring-blue-400 outline-none"
          value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>

      {/* ── BOTÕES ── */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancelar</button>
        <button type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md font-medium">Salvar Guia</button>
      </div>

    </form>
  );
};
