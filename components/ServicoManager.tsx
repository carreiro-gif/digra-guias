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

  const handleEdit = (servico: ServicoPreco) => {
    setCurrentServico(servico);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentServico({ descricao: '', valorUnitario: 0, categoria: 'Programacao' });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentServico.descricao) return alert('Descrição é obrigatória');

    const servicoToSave: ServicoPreco = {
      id: currentServico.id || Math.random().toString(36).substr(2, 9),
      descricao: currentServico.descricao!,
      categoria: currentServico.categoria || 'Programacao',
      valorUnitario: parseFloat(currentServico.valorUnitario?.toString() || '0')
    };

    onSave(servicoToSave);
    setIsEditing(false);
    setCurrentServico({});
  };

  // Sort and filter the services alphabetically by description
  const filteredServicos = [...servicos]
    .filter(s => s.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.descricao.localeCompare(b.descricao));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Serviços</h2>
        <button 
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Novo Serviço
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded border border-slate-200 mb-6 max-w-lg mx-auto">
          <h3 className="font-semibold text-lg mb-4">{currentServico.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Descrição</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentServico.descricao || ''} 
                onChange={e => setCurrentServico({...currentServico, descricao: e.target.value})}
                placeholder="Ex: Cartaz A3"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Categoria</label>
              <select
                className="w-full border p-2 rounded"
                value={currentServico.categoria || 'Programacao'}
                onChange={e => setCurrentServico({...currentServico, categoria: e.target.value as any})}
              >
                <option value="Programacao">Programação</option>
                <option value="Sinalizacao">Sinalização</option>
                <option value="Impressao">Impressão</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Valor Unitário (R$)</label>
              <input 
                type="number"
                step="0.01"
                className="w-full border p-2 rounded" 
                value={currentServico.valorUnitario || ''} 
                onChange={e => setCurrentServico({...currentServico, valorUnitario: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
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
              className="w-full border border-slate-300 rounded p-2"
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto border rounded-lg max-h-96">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Valor (R$)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm">
                {filteredServicos.map(serv => (
                  <tr key={serv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{serv.descricao}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        serv.categoria === 'Programacao' ? 'bg-purple-100 text-purple-800' :
                        serv.categoria === 'Sinalizacao' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {serv.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{serv.valorUnitario.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(serv)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => {
                           if(window.confirm(`Deseja excluir ${serv.descricao}?`)) onDelete(serv.id);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};