
import React, { useState } from 'react';
import { Operador } from '../types';

interface OperadorManagerProps {
  operadores: Operador[];
  onSave: (operador: Operador) => void;
  onDelete: (id: string) => void;
}

export const OperadorManager: React.FC<OperadorManagerProps> = ({ operadores, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentOperador, setCurrentOperador] = useState<Partial<Operador>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (op: Operador) => {
    setCurrentOperador(op);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentOperador({ nome: '' });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOperador.nome) return alert('Nome é obrigatório');

    const opToSave: Operador = {
      id: currentOperador.id || Math.random().toString(36).substr(2, 9),
      nome: currentOperador.nome
    };

    onSave(opToSave);
    setIsEditing(false);
    setCurrentOperador({});
  };

  // Sort alphabetically
  const sortedOperadores = [...operadores].sort((a, b) => a.nome.localeCompare(b.nome));
  
  const filteredOperadores = sortedOperadores.filter(op => 
    op.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Equipe (Operadores)</h2>
        <button 
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Novo Operador
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded border border-slate-200 mb-6 max-w-lg mx-auto">
          <h3 className="font-semibold text-lg mb-4">{currentOperador.id ? 'Editar Operador' : 'Novo Operador'}</h3>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase">Nome do Operador</label>
            <input 
              className="w-full border p-2 rounded" 
              value={currentOperador.nome || ''} 
              onChange={e => setCurrentOperador({...currentOperador, nome: e.target.value})}
              placeholder="Ex: João da Silva"
              autoFocus
            />
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
              placeholder="Buscar operador..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm">
                {filteredOperadores.map(op => (
                  <tr key={op.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{op.nome}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(op)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => {
                           if(window.confirm(`Deseja excluir ${op.nome}?`)) onDelete(op.id);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOperadores.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-4 text-center text-slate-500">Nenhum operador encontrado.</td>
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
