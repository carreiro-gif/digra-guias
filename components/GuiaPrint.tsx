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

const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Bras%C3%A3o_do_Estado_Rio_de_Janeiro.svg/180px-Bras%C3%A3o_do_Estado_Rio_de_Janeiro.svg.png";

export const GuiaPrint: React.FC<GuiaPrintProps> = ({ guia, onClose }) => {
  // State for logo with cache busting
  const [logoSrc, setLogoSrc] = useState(`${LOGO_URL}?v=${Date.now()}`);
  const [logoError, setLogoError] = useState(false);

  // Auto-print on mount after a small delay to ensure rendering
  useEffect(() => {
    // Force preview update for the environment
    if (typeof (window as any).updatePreview === 'function') {
      (window as any).updatePreview();
    }

    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    // Reset error state to try again
    setLogoError(false);
    // Update timestamp to bust cache for the logo
    setLogoSrc(`${LOGO_URL}?refresh=${Date.now()}`);
    
    // Explicitly call updatePreview if available
    if (typeof (window as any).updatePreview === 'function') {
      (window as any).updatePreview();
    }
  };

  // Config for pagination
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
        #logo-pjerj { 
          filter: grayscale(100%) contrast(110%); 
        }
        
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
          
          #logo-pjerj { 
            filter: grayscale(100%) contrast(110%); 
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
          onClick={handleRefresh}
          id="btn-refresh"
          className="bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          Atualizar Preview
        </button>
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
              {/* Logo */}
              <div className="w-[20%] flex justify-start items-center pl-2">
                {!logoError ? (
                  <img 
                    id="logo-pjerj"
                    src={logoSrc} 
                    alt="Brasão RJ" 
                    className="w-auto h-auto object-contain"
                    style={{ maxHeight: '24mm' }}
                    crossOrigin="anonymous"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-black p-1 rounded" style={{ width: '20mm', height: '22mm' }}>
                     <div className="text-[14px] font-bold tracking-tighter">PJERJ</div>
                     <div className="text-[7px] text-center leading-tight mt-1">Brasão<br/>Indisponível</div>
                  </div>
                )}
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
                {/* Exibição do número do processo se ativo */}
                {guia.processoAtivo && guia.numeroProcesso && (
                  <div className="font-bold text-[9px] uppercase mt-0.5">
                    PROCESSO Nº {guia.numeroProcesso}
                  </div>
                )}
                <div className="mt-0.5">Data: {new Date(guia.dataEmissao).toLocaleDateString('pt-BR')}</div>
                <div className="text-[8px] mt-1 text-gray-500">Pág. {page.pageNumber}/{totalPages}</div>
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
                        {/* Removido o Operador da impressão conforme solicitado */}
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
                    {/* Removido Serviço Externo da impressão conforme solicitado */}
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
                <div className="text-[8px] text-center mt-2 font-medium">DIGRA - Sistema de Gestão de Remessa</div>
              </footer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
