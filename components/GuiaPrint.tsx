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
const LOGO_PJERJ_BASE64 = "data:image/png;base64,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

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
