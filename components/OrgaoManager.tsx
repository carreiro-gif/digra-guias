
import React, { useState } from 'react';
import { Orgao } from '../types';

interface OrgaoManagerProps {
  orgaos: Orgao[];
  onSave: (orgao: Orgao) => void;
  onDelete: (id: string) => void;
}

export const OrgaoManager: React.FC<OrgaoManagerProps> = ({ orgaos, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrgao, setCurrentOrgao] = useState<Partial<Orgao>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (orgao: Orgao) => {
    setCurrentOrgao(orgao);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentOrgao({
      sigla: '',
      nome: '',
      comarca: 'Capital',
      forum: '',
      endereco: '',
      telefone: '',
      cep: ''
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgao.nome || !currentOrgao.sigla) return alert('Nome e Sigla são obrigatórios');

    const orgaoToSave: Orgao = {
      id: currentOrgao.id || Math.random().toString(36).substr(2, 9),
      sigla: currentOrgao.sigla!,
      nome: currentOrgao.nome!,
      comarca: currentOrgao.comarca || '',
      forum: currentOrgao.forum || '',
      endereco: currentOrgao.endereco || '',
      telefone: currentOrgao.telefone || '',
      cep: currentOrgao.cep || ''
    };

    onSave(orgaoToSave);
    setIsEditing(false);
    setCurrentOrgao({});
  };

  const filteredOrgaos = orgaos.filter(o => 
    o.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.comarca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Órgãos</h2>
        <button 
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Novo Órgão
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded border border-slate-200 mb-6">
          <h3 className="font-semibold text-lg mb-4">{currentOrgao.id ? 'Editar Órgão' : 'Cadastrar Novo Órgão'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Sigla</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.sigla || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, sigla: e.target.value})}
                placeholder="Ex: DAF-CAP"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Nome Completo</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.nome || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, nome: e.target.value})}
                placeholder="Ex: Divisão de Administração..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Comarca</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.comarca || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, comarca: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Fórum</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.forum || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, forum: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase">Endereço</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.endereco || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, endereco: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">CEP</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.cep || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, cep: e.target.value})}
                placeholder="00000-000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase">Telefone</label>
              <input 
                className="w-full border p-2 rounded" 
                value={currentOrgao.telefone || ''} 
                onChange={e => setCurrentOrgao({...currentOrgao, telefone: e.target.value})}
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
              placeholder="Buscar por nome, sigla ou comarca..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sigla</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Comarca</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">CEP</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm">
                {filteredOrgaos.map(org => (
                  <tr key={org.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{org.sigla}</td>
                    <td className="px-4 py-3">{org.nome}</td>
                    <td className="px-4 py-3">{org.comarca}</td>
                    <td className="px-4 py-3 text-slate-500">{org.cep}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(org)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => {
                           if(window.confirm(`Deseja excluir ${org.sigla}?`)) onDelete(org.id);
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
