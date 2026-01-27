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

// 🔥 FIREBASE
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./services/firebase";

// Icons
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>;

// LOGO
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div className={`rounded-full bg-[#004aad] border-2 border-white flex items-center justify-center font-bold text-white ${size === 'large' ? 'w-20 h-20' : 'w-10 h-10 text-xs'}`}>
    DIGRA
  </div>
);

function App() {

  // 🔥 FUNÇÃO DE TESTE FIREBASE
  async function salvarGuiaTesteFirebase() {
    try {
      await addDoc(collection(db, "guias"), {
        numero: "TESTE-001",
        orgao: "TJ-RJ",
        data: "2026-01-19",
        hora: "12:00",
        criadoEm: Timestamp.now()
      });
      alert("✅ Guia salva com sucesso no Firebase!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar no Firebase");
    }
  }

  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  return (
    <div className="p-10 space-y-6">

      {/* 🔴 BOTÃO DE TESTE — DEPOIS VAMOS REMOVER */}
      <button
        onClick={salvarGuiaTesteFirebase}
        className="bg-red-600 text-white px-6 py-3 rounded font-bold"
      >
        🔥 TESTE – SALVAR NO FIREBASE
      </button>

      <div className="flex gap-4">
        <button onClick={() => setActiveTab('form')} className="bg-blue-600 text-white px-4 py-2 rounded">Nova Guia</button>
        <button onClick={() => setActiveTab('list')} className="bg-slate-600 text-white px-4 py-2 rounded">Histórico</button>
      </div>

      {activeTab === 'list' && <p>Histórico (local)</p>}
      {activeTab === 'form' && <p>Formulário</p>}

      <footer className="text-xs text-slate-500 mt-10">
        ⚡ Alexandre | DIGRA Apps
      </footer>
    </div>
  );
}

export default App;
