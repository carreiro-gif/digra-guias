import React, { useState, useEffect } from 'react';
import { ResponsavelExterno } from '../types';

// ── localStorage: lista de nomes marcados como padrão ──
const LS_PADRAO = 'digra_responsaveis_padrao';

export const getPadraoResponsaveis = (): string[] => {
  try { return JSON.parse(localStorage.getItem(LS_PADRAO) || '[]'); } catch { return []; }
};

const setPadraoResponsaveis = (nomes: string[]) => {
  localStorage.setItem(LS_PADRAO, JSON.stringify(nomes));
};

interface ResponsavelManagerProps {
  responsaveis: ResponsavelExterno[];
  onSave: (responsavel: ResponsavelExterno) => void;
  onDelete: (id: string) => void;
}

export const ResponsavelManager: React.FC<ResponsavelManagerProps> = ({ responsaveis, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentResp, setCurrentResp] = useState<Partial<ResponsavelExterno>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [padrao, setPadrao] = useState<string[]>(() => getPadraoResponsaveis());
  const [savedMsg, setSavedMsg] = useState(false);

  // Sincroniza o localStorage sempre que padrao muda
  useEffect(() => {
    setPadraoResponsaveis(padrao);
  }, [padrao]);

  const handleEdit = (resp: ResponsavelExterno) => {
    setCurrentResp(resp);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentResp({ nome: '' });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResp.nome?.trim()) return alert('Nome é obrigatório');
    const respToSave: ResponsavelExterno = {
      id: currentResp.id || Math.random().toString(36).substr(2, 9),
      nome: currentResp.nome.trim()
    };
    onSave(respToSave);
    setIsEditing(false);
    setCurrentResp({});
  };

  const togglePadrao = (nome: string) => {
    setPadrao(prev =>
      prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
    );
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const filteredResponsaveis = [...responsaveis]
    .sort((a, b) => {
      // Padrão primeiro, depois alfabético
      const ap = padrao.includes(a.nome) ? 0 : 1;
      const bp = padrao.includes(b.nome) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.nome.localeCompare(b.nome);
    })
    .filter(r => r.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Responsáveis</h2>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Novo Responsável
        </button>
      </div>

      {/* Legenda padrão */}
      <div className="flex items-center gap-2 mb-5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Padrão
        </span>
        <span>= pré-selecionado automaticamente em toda nova guia. Clique na estrela para marcar/desmarcar.</span>
        {savedMsg && <span className="text-emerald-600 font-semibold ml-2">✓ Salvo!</span>}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 max-w-lg mx-auto">
          <h3 className="font-bold text-lg mb-5 text-slate-800">
            {currentResp.id ? 'Editar Responsável' : 'Novo Responsável'}
          </h3>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome</label>
            <input
              className="w-full border-2 border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
              value={currentResp.nome || ''}
              onChange={e => setCurrentResp({ ...currentResp, nome: e.target.value })}
              placeholder="Ex: Rolliug de Assis"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-xs text-slate-400 mb-2">
            {filteredResponsaveis.length} responsável(is) · {padrao.length} marcado(s) como padrão
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-16">Padrão</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-sm">
                {filteredResponsaveis.map(r => {
                  const isPadrao = padrao.includes(r.nome);
                  return (
                    <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${isPadrao ? 'bg-blue-50/40' : ''}`}>
                      {/* Botão estrela */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePadrao(r.nome)}
                          title={isPadrao ? 'Remover dos padrões' : 'Marcar como padrão'}
                          className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto transition-all ${
                            isPadrao
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill={isPadrao ? 'currentColor' : 'none'}
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isPadrao ? 'text-blue-800' : 'text-slate-700'}`}>{r.nome}</span>
                          {isPadrao && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">padrão</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Editar
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Excluir "${r.nome}"?`)) onDelete(r.id); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredResponsaveis.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">Nenhum responsável encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
