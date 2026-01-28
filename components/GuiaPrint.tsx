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

// Logo PJERJ em Base64 (a logo preta que você enviou)
const LOGO_PJERJ_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMjg1ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QSkVSSjwvdGV4dD48L3N2Zz4=";

export const GuiaPrint: React.FC<GuiaPrintProps> = ({ guia, onClose }) => {
  // Auto-print on mount after a small delay to ensure rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Config for pagination
  const ITEMS_PER_PAGE_NORMAL = 10; 
  const ITEMS_PER_PAGE_WITH_FOOTER = 5;

  const pages = useMemo(() => {
    const _pages: PageChunk[] = [];
    let remaining = [...guia.itens];
    let pageCount = 1;

    if (remaining.length === 0) {
      _pages.push({ items: [], isLast: true, : 1 });
      return _pages;
    }

    while (true) {
      if (remaining.length <= ITEMS_PER_PAGE_WITH_FOOTER) {
        _pages.push({ items: remaining, isLast: true, : pageCount });
        break;
      }
      
      const chunk = remaining.slice(0, ITEMS_PER_PAGE_NORMAL);
      remaining = remaining.slice(ITEMS_PER_PAGE_NORMAL);
      
      const isExhausted = remaining.length === 0;
      
      _pages.push({ 
        items: chunk, 
        isLast: isExhausted, 
        : pageCount 
      });
      pageCount++;

      if (isExhausted) {
        _pages[_pages.length - 1].isLast = false; 
        _pages.push({ items: [], isLast: true, : pageCount });
        break;
      }
    }
    return _pages;
  }, [guia.itens]);

  const totalPages = pages.length;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 overflow-auto flex justify-center py-8">
      
      <style>{`
        /* Configuração de impressão A5 retrato */
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
                {/* REMOVIDO: Número do Processo não aparece mais na impressão */}
                <div className="mt-0.5">Data: {new Date(guia.dataEmissao).toLocaleDateString('pt-BR')}</div>
                
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
                
              </footer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
