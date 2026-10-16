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
// 👥 RESPONSÁVEIS PADRÃO
// ===========================
const RESPONSAVEIS_PADRAO = [
  'Valmir Marcante',
  'Márcio Souza',
  'Rolliug de Assis',
  'André José de Carvalho',
];

// ===========================
// 💾 AUTOCOMPLETE - SOLICITANTE
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
// 💾 AUTOCOMPLETE - DETALHES
// ===========================
const LS_DETALHES = 'digra_detalhes_conhecidos';
const getDetalhesConhecidos = (): string[] => {
  try { return JSON.parse(localStorage.getItem(LS_DETALHES) || '[]'); }
  catch { return []; }
};
const salvarDetalheLS = (detalhe: string) => {
  if (!detalhe.trim()) return;
  const lista = getDetalhesConhecidos();
  if (!lista.map(d => d.toLowerCase()).includes(detalhe.trim().toLowerCase())) {
    localStorage.setItem(LS_DETALHES, JSON.stringify([...lista, detalhe.trim()].sort()));
  }
};

// ===========================
// TIPOS INTERNOS
// ===========================
interface ItemExtras {
  selectedSubtype: string;
  customSubtype: string;
  tamanho: string;
  serviceSearch: string;      // texto digitado no campo de serviço
  showServiceDrop: boolean;   // dropdown de serviço aberto
  detalheSearch: string;      // texto digitado em detalhes (para autocomplete)
  showDetalheDrop: boolean;   // dropdown de detalhes aberto
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

  const [items, setItems] = useState<ItemGuia[]>(() => {
    if (initialData?.itens && initialData.itens.length > 0) return initialData.itens;
    return [{ id: Math.random().toString(36).substr(2, 9), servicoId: '', descricao: '', detalhes: '', quantidade: 1, valorUnitario: 0, status: StatusServico.CONCLUIDO }];
  });

  const [itemExtras, setItemExtras] = useState<Record<string, ItemExtras>>({});

  // Pré-seleciona os 4 responsáveis padrão se não for edição
  const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>(() => {
    if (initialData?.responsaveisExternos) return initialData.responsaveisExternos;
    return RESPONSAVEIS_PADRAO;
  });

  const [numeroGuia, setNumeroGuia] = useState<string>(initialData?.numero || suggestedNumber || '');
  const [orgSearch, setOrgSearch] = useState('');

  // Autocomplete solicitante
  const [solicitanteSuggestions, setSolicitanteSuggestions] = useState<string[]>([]);
  const [showSolicitanteDrop, setShowSolicitanteDrop] = useState(false);
  const solicitanteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (solicitanteRef.current && !solicitanteRef.current.contains(e.target as Node))
        setShowSolicitanteDrop(false);
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

  // ─── EXTRAS helpers ───────────────────────────────
  const getExtras = (itemId: string): ItemExtras =>
    itemExtras[itemId] || { selectedSubtype: '', customSubtype: '', tamanho: '', serviceSearch: '', showServiceDrop: false, detalheSearch: '', showDetalheDrop: false };

  const updateExtras = (itemId: string, patch: Partial<ItemExtras>) =>
    setItemExtras(prev => ({ ...prev, [itemId]: { ...getExtras(itemId), ...patch } }));

  const getFinalSubtype = (extras: ItemExtras): string =>
    extras.selectedSubtype === 'Outro' ? extras.customSubtype : extras.selectedSubtype;

  const buildDescricao = (item: ItemGuia): string => {
    const extras = getExtras(item.id);
    const subtype = getFinalSubtype(extras);
    return [item.descricao, subtype, extras.tamanho].filter(Boolean).join(' - ');
  };

  // ─── SOLICITANTE ──────────────────────────────────
  const handleSolicitanteChange = (value: string) => {
    setSolicitante(value);
    if (value.length >= 2) {
      const f = getSolicitantesConhecidos().filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSolicitanteSuggestions(f);
      setShowSolicitanteDrop(f.length > 0);
    } else {
      setShowSolicitanteDrop(false);
    }
  };

  // ─── ITEMS ────────────────────────────────────────
  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), servicoId: '', descricao: '', detalhes: '', quantidade: 1, valorUnitario: 0, status: StatusServico.CONCLUIDO }]);
  };

  const updateItem = (index: number, field: keyof ItemGuia, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const itemId = items[index].id;
    setItems(items.filter((_, i) => i !== index));
    setItemExtras(prev => { const next = { ...prev }; delete next[itemId]; return next; });
  };

  // ─── SERVIÇO AUTOCOMPLETE por item ───────────────
  const getFilteredServicos = (search: string): ServicoPreco[] => {
    if (!search.trim()) return [...servicosList].sort((a, b) => a.descricao.localeCompare(b.descricao)).slice(0, 8);
    return servicosList
      .filter(s => s.descricao.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.descricao.localeCompare(b.descricao));
  };

  const handleServiceSearchChange = (index: number, value: string) => {
    const item = items[index];
    updateItem(index, 'descricao', value);
    updateItem(index, 'servicoId', 'custom_new');
    updateExtras(item.id, { serviceSearch: value, showServiceDrop: true });
  };

  const handleSelectServico = (index: number, servico: ServicoPreco) => {
    const item = items[index];
    const newItems = [...items];
    newItems[index] = { ...newItems[index], servicoId: servico.id, descricao: servico.descricao, valorUnitario: servico.valorUnitario };
    setItems(newItems);
    updateExtras(item.id, { serviceSearch: servico.descricao, showServiceDrop: false, selectedSubtype: '', customSubtype: '', tamanho: '' });
  };

  // ─── DETALHES AUTOCOMPLETE por item ──────────────
  const getFilteredDetalhes = (search: string): string[] => {
    if (!search.trim()) return [];
    return getDetalhesConhecidos().filter(d => d.toLowerCase().includes(search.toLowerCase())).slice(0, 6);
  };

  // ─── RESPONSÁVEIS ─────────────────────────────────
  const toggleResponsavel = (nome: string) =>
    setSelectedResponsaveis(prev => prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]);

  const toggleAllResponsaveis = () =>
    setSelectedResponsaveis(selectedResponsaveis.length === responsaveisList.length ? [] : responsaveisList.map(r => r.nome));

  // ─── CONSTRUIR + SALVAR ───────────────────────────
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Adicione pelo menos um item');
    const guia = constructGuia();
    if (!guia) return alert('Selecione um órgão válido');

    // Auto-cadastrar serviços novos digitados
    for (const item of items) {
      if (item.servicoId === 'custom_new' && item.descricao.trim()) {
        const novoServico: ServicoPreco = {
          id: Math.random().toString(36).substr(2, 9),
          descricao: item.descricao.trim(),
          categoria: 'Programacao',
          valorUnitario: item.valorUnitario || 0
        };
        if (onAddGlobalServico) onAddGlobalServico(novoServico);
      }
    }

    // Salvar detalhes no localStorage
    items.forEach(item => { if (item.detalhes) salvarDetalheLS(item.detalhes); });

    salvarSolicitanteLS(solicitante);
    onSave(guia);
  };

  const handlePrintClick = () => {
    const guia = constructGuia();
    if (!guia) { alert('Preencha os dados do órgão antes de imprimir.'); return; }
    onPrint(guia);
  };

  // ─── FILTROS ─────────────────────────────────────
  const filteredOrgs = orgSearch
    ? orgaosList.filter(o => {
        const t = orgSearch.toLowerCase().trim();
        return o.nome.toLowerCase().includes(t) || o.sigla.toLowerCase().includes(t) ||
          (o.endereco && o.endereco.toLowerCase().includes(t)) ||
          (o.telefone && o.telefone.toLowerCase().includes(t));
      })
    : orgaosList;

  const sortedOperadores = [...operadoresList].sort((a, b) => a.nome.localeCompare(b.nome));

  // Ordenar lista de responsáveis: padrão primeiro, depois o resto
  const sortedResponsaveis = [...responsaveisList].sort((a, b) => {
    const aIsPadrao = RESPONSAVEIS_PADRAO.includes(a.nome);
    const bIsPadrao = RESPONSAVEIS_PADRAO.includes(b.nome);
    if (aIsPadrao && !bIsPadrao) return -1;
    if (!aIsPadrao && bIsPadrao) return 1;
    const aIdx = RESPONSAVEIS_PADRAO.indexOf(a.nome);
    const bIdx = RESPONSAVEIS_PADRAO.indexOf(b.nome);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto relative">

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
                if (f.length > 0) { setSolicitanteSuggestions(f); setShowSolicitanteDrop(true); }
              }
            }}
            placeholder="Nome de quem pediu"
          />
          {showSolicitanteDrop && solicitanteSuggestions.length > 0 && (
            <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-md shadow-xl max-h-48 overflow-auto w-full">
              {solicitanteSuggestions.map((nome, i) => (
                <div key={i} className="p-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0 flex items-center gap-2"
                  onMouseDown={e => { e.preventDefault(); setSolicitante(nome); setShowSolicitanteDrop(false); }}>
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

      {/* ── PROCESSO (opcional) ── */}
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
          <button type="button" onClick={handleAddItem}
            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm flex items-center gap-1 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Adicionar Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const subtipos = getSubtiposDoServico(item.descricao);
            const extras = getExtras(item.id);
            const showPreview = !!(extras.selectedSubtype || extras.tamanho);
            const servicosFiltrados = getFilteredServicos(item.descricao);
            const isCustomNew = item.servicoId === 'custom_new';
            const detalhesSugeridos = getFilteredDetalhes(item.detalhes);

            return (
              <div key={item.id} className="border border-slate-200 p-4 rounded-xl bg-slate-50 relative">
                <button type="button" onClick={() => removeItem(index)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors text-xl leading-none font-bold">×</button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

                  {/* Serviço - AUTOCOMPLETE */}
                  <div className="md:col-span-5 relative">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Serviço</label>
                    <input type="text" autoComplete="off"
                      className={`w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none ${isCustomNew && item.descricao ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300'}`}
                      value={item.descricao}
                      placeholder="Digite para buscar ou criar..."
                      onChange={e => handleServiceSearchChange(index, e.target.value)}
                      onFocus={() => updateExtras(item.id, { showServiceDrop: true })}
                      onBlur={() => setTimeout(() => updateExtras(item.id, { showServiceDrop: false }), 150)}
                    />
                    {isCustomNew && item.descricao && (
                      <div className="text-xs text-emerald-600 mt-1">✨ Novo serviço — será cadastrado ao salvar</div>
                    )}
                    {extras.showServiceDrop && (
                      <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-lg shadow-xl w-full max-h-52 overflow-auto">
                        {servicosFiltrados.length > 0 && servicosFiltrados.map(s => (
                          <div key={s.id} onMouseDown={() => handleSelectServico(index, s)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0">
                            <span className="font-medium text-slate-800">{s.descricao}</span>
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                              s.categoria === 'Programacao' ? 'bg-purple-100 text-purple-700' :
                              s.categoria === 'Sinalizacao' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'}`}>{s.categoria}</span>
                          </div>
                        ))}
                        {item.descricao.trim() && !servicosList.some(s => s.descricao.toLowerCase() === item.descricao.trim().toLowerCase()) && (
                          <div onMouseDown={() => updateExtras(item.id, { showServiceDrop: false })}
                            className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 cursor-pointer text-sm text-emerald-700 font-medium flex items-center gap-2 border-t border-emerald-200">
                            <span className="text-lg leading-none">+</span>
                            Criar "{item.descricao.trim()}" como novo serviço
                          </div>
                        )}
                        {servicosFiltrados.length === 0 && !item.descricao.trim() && (
                          <div className="px-3 py-2 text-xs text-slate-400 text-center">Digite para buscar...</div>
                        )}
                      </div>
                    )}
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

                  {/* Detalhes - com autocomplete */}
                  <div className="md:col-span-12 relative">
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                      Detalhes <span className="text-slate-400 normal-case font-normal">(Gramatura, Cor, Acabamento - opcional)</span>
                    </label>
                    <input type="text" autoComplete="off"
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      value={item.detalhes}
                      onChange={e => { updateItem(index, 'detalhes', e.target.value); updateExtras(item.id, { showDetalheDrop: true }); }}
                      onFocus={() => updateExtras(item.id, { showDetalheDrop: true })}
                      onBlur={() => setTimeout(() => updateExtras(item.id, { showDetalheDrop: false }), 150)}
                      placeholder="Ex: Papel Couchê 150g, 4x0" />
                    {extras.showDetalheDrop && detalhesSugeridos.length > 0 && (
                      <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-lg shadow-xl w-full max-h-40 overflow-auto">
                        {detalhesSugeridos.map((d, i) => (
                          <div key={i} onMouseDown={() => { updateItem(index, 'detalhes', d); updateExtras(item.id, { showDetalheDrop: false }); }}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0 text-slate-700">
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
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
                          <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sortedResponsaveis.map(resp => {
            const isPadrao = RESPONSAVEIS_PADRAO.includes(resp.nome);
            return (
              <label key={resp.id} className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-colors ${isPadrao ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-100'}`}>
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedResponsaveis.includes(resp.nome)} onChange={() => toggleResponsavel(resp.nome)} />
                <span className={`text-sm ${isPadrao ? 'text-blue-800 font-medium' : 'text-slate-700'}`}>{resp.nome}</span>
                {isPadrao && <span className="text-xs text-blue-400 ml-auto">padrão</span>}
              </label>
            );
          })}
          {responsaveisList.length === 0 && <span className="text-xs text-slate-500 col-span-2">Nenhum responsável cadastrado.</span>}
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
