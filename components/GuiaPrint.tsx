import React, { useMemo, useState, useEffect } from 'react';
import { Guia, ItemGuia } from '../types';

interface GuiaPrintProps {
  guia: Guia;
  onClose: () => void;
}

interface PageChunk {
  items: ItemGuia[];
  isLast: boolean;
  pageNumber: number;
}

// Logo PJERJ em Base64
const LOGO_PJERJ_BASE64 = "data:image/png;base64,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

export const GuiaPrint: React.FC<GuiaPrintProps> = ({ guia, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const ITEMS_PER_PAGE_NORMAL = 10; 
  const ITEMS_PER_PAGE_WITH_FOOTER = 5;

  const pages = useMemo(() => {
    const _pages: PageChunk[] = [];
    let remaining = [...guia.itens];
    let pageCount = 1;

    if (remaining.length === 0) {
      _pages.push({ items: [], isLast: true, pageNumber: 1 });
      return _pages;
    }

    while (true) {
      if (remaining.length <= ITEMS_PER_PAGE_WITH_FOOTER) {
        _pages.push({ items: remaining, isLast: true, pageNumber: pageCount });
        break;
      }
      
      const chunk = remaining.slice(0, ITEMS_PER_PAGE_NORMAL);
      remaining = remaining.slice(ITEMS_PER_PAGE_NORMAL);
      
      const isExhausted = remaining.length === 0;
      
      _pages.push({ 
        items: chunk, 
        isLast: isExhausted, 
        pageNumber: pageCount 
      });
      pageCount++;

      if (isExhausted) {
        _pages[_pages.length - 1].isLast = false; 
        _pages.push({ items: [], isLast: true, pageNumber: pageCount });
        break;
      }
    }
    return _pages;
  }, [guia.itens]);

  const totalPages = pages.length;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 overflow-auto flex justify-center py-8">
      
      <style>{`
        @page {
          size: A5 portrait;
          margin: 10mm;
        }
        
        @media print { 
          html, body {
            width: 148mm;
            height: 210mm;
          }
          
          .no-print, .no-print-content { 
            display: none !important; 
          }
          
          .print-page {
            page-break-after: always;
            width: 148mm;
            height: 210mm;
            padding: 10mm;
            box-sizing: border-box;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          .print-root {
            width: 148mm;
          }
        }
      `}</style>

      {/* Floating Controls */}
      <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Imprimir A5
        </button>
        <button 
          onClick={onClose}
          className="bg-white text-slate-800 px-6 py-3 rounded-full shadow-lg hover:bg-slate-100 font-bold"
        >
          Fechar
        </button>
      </div>

      <div className="print-root flex flex-col gap-8 print:gap-0">
        {pages.map((page) => (
          <div key={page.pageNumber} className="print-page shadow-2xl print:shadow-none bg-white text-black font-sans">
            
            {/* --- HEADER --- */}
            <header className="flex flex-row items-center border-b border-black pb-4 mb-4">
              {/* Logo PJERJ */}
              <div className="w-[20%] flex justify-start items-center pl-2">
                <img 
                  src={LOGO_PJERJ_BASE64}
                  alt="PJERJ" 
                  className="w-auto h-auto object-contain"
                  style={{ maxHeight: '24mm', maxWidth: '24mm' }}
                />
              </div>

              {/* Institutional Text */}
              <div className="w-[50%] text-[9px] font-bold leading-tight uppercase text-center flex flex-col justify-center">
                <span>Poder Judiciário do Estado do Rio de Janeiro</span>
                <span>Diretoria Geral de Logística</span>
                <span>Departamento de Patrimônio e Material</span>
                <span className="mt-1">Divisão de Produção Gráfica (DIGRA)</span>
              </div>

              {/* Metadata */}
              <div className="w-[30%] text-right flex flex-col justify-center text-[10px] pr-2">
                <div className="font-bold">Nº da Guia: <span className="text-sm">{guia.numero}</span></div>
                <div className="mt-0.5">Data: {new Date(guia.dataEmissao).toLocaleDateString('pt-BR')}</div>
                {/* REMOVIDO: Pág. X/Y */}
              </div>
            </header>

            {/* Title */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold uppercase border border-black inline-block px-8 py-1 tracking-wider">
                GUIA
              </h1>
            </div>

            {/* --- INFO BLOCKS --- */}
            <section className="text-[11px] mb-4 space-y-1 px-2">
              <div className="flex">
                <span className="font-bold w-28">Órgão Requisitante:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">{guia.orgaoSnapshot.nome} ({guia.orgaoSnapshot.sigla})</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Contato:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">{guia.solicitante || ''}</span>
                <span className="font-bold ml-2 mr-1">Tel:</span>
                <span className="border-b border-dotted border-gray-400 min-w-[80px]">{guia.orgaoSnapshot.telefone || ''}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Endereço:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">{guia.orgaoSnapshot.endereco} {guia.orgaoSnapshot.cep ? `- CEP: ${guia.orgaoSnapshot.cep}` : ''}</span>
              </div>
            </section>

            {/* --- TABLE --- */}
            <div className="flex-1 flex flex-col px-2">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-center py-1 border-r border-black w-[15%] font-bold">Qtde</th>
                    <th className="text-left px-2 py-1 border-r border-black w-[25%] font-bold">Tipo</th>
                    <th className="text-left px-2 py-1 w-[60%] font-bold">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300 last:border-black">
                      <td className="text-center py-2 border-r border-black align-top font-medium">{item.quantidade}</td>
                      <td className="px-2 py-2 border-r border-black align-top font-medium">{item.descricao}</td>
                      <td className="px-2 py-2 align-top">
                        <div className="font-normal text-[10px]">{item.detalhes || '-'}</div>
                      </td>
                    </tr>
                  ))}
                  {page.items.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center italic text-gray-500">-- Continuação --</td></tr>
                  )}
                </tbody>
              </table>
              {!page.isLast && (
                 <div className="mt-2 text-right text-[9px] italic">Continua na próxima página...</div>
              )}
            </div>

            {/* --- FOOTER (RECEIPT) --- */}
            {page.isLast && (
              <footer className="mt-auto pt-2 px-2 pb-2">
                {guia.observacoes && (
                  <div className="mb-4 border border-black p-2 text-[10px]">
                    <div className="mb-2">
                      <div className="font-bold mb-1">OBSERVAÇÕES:</div>
                      <div className="whitespace-pre-wrap leading-tight">{guia.observacoes}</div>
                    </div>
                  </div>
                )}
                <div className="border border-black p-2">
                  <h3 className="text-center font-bold text-[11px] uppercase mb-4 bg-gray-100 border-b border-black -mx-2 -mt-2 py-1">
                    Recebimento
                  </h3>
                  <div className="space-y-3 text-[10px]">
                    <div className="flex gap-4 items-end"><div className="w-16 font-bold shrink-0">Nome:</div><div className="flex-1 border-b border-black h-4"></div></div>
                    <div className="flex gap-4 items-end"><div className="w-16 font-bold shrink-0">Matrícula/RG:</div><div className="flex-1 border-b border-black h-4"></div></div>
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Cargo:</div><div className="flex-1 border-b border-black h-4"></div>
                      <div className="w-10 font-bold shrink-0 text-right">Data:</div><div className="w-24 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end pt-2"><div className="w-16 font-bold shrink-0">Assinatura:</div><div className="flex-1 border-b border-black h-4"></div></div>
                  </div>
                </div>
                {/* REMOVIDO: DIGRA - Sistema de Gestão de Remessa */}
              </footer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
