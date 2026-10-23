import React, { useState } from 'react';
import { ServicoPreco } from '../types';

interface ServicoManagerProps {
  servicos: ServicoPreco[];
  onSave: (servico: ServicoPreco) => void;
  onDelete: (id: string) => void;
}

export const ServicoManager: React.FC<ServicoManagerProps> = ({ servicos, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentServico, setCurrentServico] = useState<Partial<ServicoPreco>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [duplicateFound, setDuplicateFound] = useState<ServicoPreco | null>(null);

  const handleEdit = (servico: ServicoPreco) => {
    setCurrentServico(servico);
    setDuplicateFound(null);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentServico({ descricao: '', categoria: 'Programacao' });
    setDuplicateFound(null);
    setIsEditing(true);
  };

  const handleDescricaoChange = (valor: string) => {
    setCurrentServico(prev => ({ ...prev, descricao: valor }));
    // Verifica duplicata em tempo real (ignora o próprio item em edição)
    const dup = servicos.find(
      s => s.descricao.toLowerCase().trim() === valor.toLowerCase().trim()
        && s.id !== currentServico.id
    );
    setDuplicateFound(dup || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentServico.descricao?.trim()) return alert('Descrição é obrigatória');
    if (duplicateFound) return; // bloqueia se duplicado

    const servicoToSave: ServicoPreco = {
      id: currentServico.id || Math.random().toString(36).substr(2, 9),
      descricao: currentServico.descricao.trim(),
      categoria: currentServico.categoria || 'Programacao',
      valorUnitario: 0
    };

    onSave(servicoToSave);
    setIsEditing(false);
    setCurrentServico({});
    setDuplicateFound(null);
  };

  const filteredServicos = [...servicos]
    .filter(s => s.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.descricao.localeCompare(b.descricao));

  const categoriaBadge = (cat: string) => {
    if (cat === 'Programacao') return 'bg-purple-100 text-purple-700';
    if (cat === 'Sinalizacao') return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Serviços</h2>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Novo Serviço
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 max-w-lg mx-auto">
          <h3 className="font-bold text-lg mb-5 text-slate-800">
            {currentServico.id ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          <div className="space-y-4">

            {/* Descrição com verificação de duplicata */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</label>
              <input
                className={`w-full border-2 rounded-lg p-2.5 outline-none focus:ring-2 transition-colors ${
                  duplicateFound
                    ? 'border-amber-400 bg-amber-50 focus:ring-amber-300'
                    : 'border-slate-300 focus:ring-blue-400'
                }`}
                value={currentServico.descricao || ''}
                onChange={e => handleDescricaoChange(e.target.value)}
                placeholder="Ex: Cartaz A3"
                autoFocus
              />
              {/* Aviso de duplicata */}
              {duplicateFound && (
                <div className="mt-2 bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div>
                    <p className="text-sm font-bold text-amber-700">Este serviço já está cadastrado</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      "{duplicateFound.descricao}" — categoria: <strong>{duplicateFound.categoria}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleEdit(duplicateFound)}
                      className="mt-1.5 text-xs font-semibold text-amber-700 underline hover:text-amber-900"
                    >
                      Abrir para editar →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoria</label>
              <select
                className="w-full border-2 border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                value={currentServico.categoria || 'Programacao'}
                onChange={e => setCurrentServico({ ...currentServico, categoria: e.target.value as any })}
              >
                <option value="Programacao">Programação</option>
                <option value="Sinalizacao">Sinalização</option>
                <option value="Impressao">Impressão</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setDuplicateFound(null); }}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!!duplicateFound}
              className={`px-5 py-2 rounded-lg text-white font-semibold shadow-sm transition-colors ${
                duplicateFound ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
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
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-xs text-slate-400 mb-2">{filteredServicos.length} serviço(s) cadastrado(s)</div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[32rem]">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-sm">
                {filteredServicos.map(serv => (
                  <tr key={serv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{serv.descricao}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoriaBadge(serv.categoria)}`}>
                        {serv.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(serv)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Excluir "${serv.descricao}"?`)) onDelete(serv.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredServicos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">Nenhum serviço encontrado.</td>
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
