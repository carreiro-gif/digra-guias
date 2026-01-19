import React, { useState } from 'react';

interface ConfigManagerProps {
  currentNextSequence: number;
  onSave: (nextSeq: number) => void;
}

export const ConfigManager: React.FC<ConfigManagerProps> = ({ currentNextSequence, onSave }) => {
  const [seq, setSeq] = useState<string>(currentNextSequence.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(seq, 10);
    if (isNaN(num) || num < 1) {
      alert('Por favor, insira um número válido (mínimo 1).');
      return;
    }
    onSave(num);
    alert('Próxima numeração atualizada com sucesso!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Ajustar Próxima Numeração</h2>
      </div>

      <div className="bg-blue-50 p-4 rounded-md mb-8 text-sm text-blue-800 border border-blue-100 leading-relaxed">
        <p><strong>Como funciona:</strong> O sistema calcula automaticamente o próximo número com base na maior guia existente no ano atual.</p>
        <p className="mt-2">Se você deseja que a próxima guia ignore o contador automático e inicie de um número específico (ex: 1253), insira o valor abaixo. O sistema usará o maior valor entre o automático e o definido aqui.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
            Próximo Número de Sequência
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-400">{new Date().getFullYear()} /</span>
            <input 
              type="number"
              min="1"
              className="flex-1 border-2 border-slate-300 rounded-lg p-3 text-xl font-bold text-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={seq}
              onChange={e => setSeq(e.target.value)}
              placeholder="Ex: 1253"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">A próxima guia aberta terá este número sugerido (se ele for maior que o atual).</p>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Salvar Alteração
          </button>
        </div>
      </form>
    </div>
  );
};