import React, { useMemo } from 'react';
import { Guia, ItemGuia } from '../types';

interface GuiaPrintProps {
  guia: Guia;
  onClose: () => void;
  autoPrint?: boolean; // true = imprime automaticamente; false = só visualiza
}

interface PageChunk {
  items: ItemGuia[];
  isLast: boolean;
  pageNumber: number;
}

const LOGO_PJERJ_BASE64 = "https://raw.githubusercontent.com/carreiro-gif/digra-logo-TJ/main/logo_tjrj.png";

export const GuiaPrint: React.FC<GuiaPrintProps> = ({ guia, onClose, autoPrint = true }) => {
  // Dispara impressão automática apenas quando autoPrint=true (ex: ao salvar nova guia)
  React.useEffect(() => {
    if (!autoPrint) return;
    const timer = setTimeout(() => { window.print(); }, 600);
    return () => clearTimeout(timer);
  }, [autoPrint]);

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

      _pages.push({ items: chunk, isLast: isExhausted, pageNumber: pageCount });
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

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 overflow-auto flex justify-center py-8">

      <style>{`
        @page {
          size: A5 portrait;
          margin: 10mm;
        }

        /* ──── MODO IMPRESSÃO ──── */
        @media print {
          /* Esconde TUDO */
          body * {
            visibility: hidden;
          }

          /* Mostra só o conteúdo das guias */
          .print-root,
          .print-root * {
            visibility: visible;
          }

          /* Posiciona o conteúdo no topo da folha */
          .print-root {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            display: block !important;
          }

          /* Cada página A5 */
          .print-page {
            page-break-after: always;
            break-after: page;
            width: 148mm;
            min-height: 210mm;
            padding: 10mm;
            box-sizing: border-box;
          }

          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          /* Esconde botões e controles */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Botões flutuantes (não imprimem) ── */}
      <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect width="12" height="8" x="6" y="14"/>
          </svg>
          {autoPrint ? 'Imprimir A5' : 'Imprimir'}
        </button>
        <button
          onClick={onClose}
          className="bg-white text-slate-800 px-6 py-3 rounded-full shadow-lg hover:bg-slate-100 font-bold"
        >
          Fechar
        </button>
      </div>

      {/* ── Páginas ── */}
      <div className="print-root flex flex-col gap-8 print:gap-0">
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            className="print-page shadow-2xl print:shadow-none bg-white text-black font-sans flex flex-col"
          >

            {/* HEADER */}
            <header className="flex flex-row items-center border-b border-black pb-4 mb-4">
              <div className="w-[20%] flex justify-start items-center pl-2">
                <img
                  src={LOGO_PJERJ_BASE64}
                  alt="PJERJ"
                  className="w-auto h-auto object-contain"
                  style={{ maxHeight: '18mm', maxWidth: '18mm' }}
                />
              </div>

              <div className="w-[50%] text-[10px] font-bold leading-snug tracking-wide uppercase text-center flex flex-col justify-center pl-3">
                <span className="whitespace-nowrap">Poder Judiciário do Estado do Rio de Janeiro</span>
                <span>Diretoria Geral de Logística</span>
                <span className="whitespace-nowrap tracking-normal text-[9.8px]">Departamento de Patrimônio e Material</span>
                <span className="mt-0.5">Divisão de Produção Gráfica (DIGRA)</span>
              </div>

              <div className="w-[30%] text-right flex flex-col justify-center text-[10px] pr-2">
                <div className="font-bold">Nº: <span className="text-sm">{guia.numero}</span></div>
                <div className="mt-0.5">Data: {new Date(guia.dataEmissao).toLocaleDateString('pt-BR')}</div>
                {/* Numeração de páginas — aparece só quando tem mais de 1 */}
                {totalPages > 1 && (
                  <div className="mt-1 font-bold text-[11px] bg-slate-100 border border-slate-300 rounded px-1 py-0.5 text-center">
                    Pág. {page.pageNumber}/{totalPages}
                  </div>
                )}
              </div>
            </header>

            {/* Título */}
            <div className="text-center mb-4">
              <h1
                className="text-[20px] font-bold uppercase border border-black inline-block tracking-wider"
                style={{ padding: '0.3mm 5.5mm' }}
              >
                GUIA
              </h1>
            </div>

            {/* INFORMAÇÕES */}
            <section className="text-[11px] mb-4 space-y-1 px-2">
              <div className="flex">
                <span className="font-bold w-28">Órgão Requisitante:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">
                  {guia.orgaoSnapshot.nome} ({guia.orgaoSnapshot.sigla})
                </span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Contato:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">{guia.solicitante || ''}</span>
                <span className="font-bold ml-2 mr-1">Tel:</span>
                <span className="border-b border-dotted border-gray-400 min-w-[80px]">{guia.orgaoSnapshot.telefone || ''}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Endereço:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">
                  {guia.orgaoSnapshot.endereco} {guia.orgaoSnapshot.cep ? `- CEP: ${guia.orgaoSnapshot.cep}` : ''}
                </span>
              </div>
            </section>

            {/* TABELA */}
            <div className="flex-1 flex flex-col px-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-black text-[11.5px]">
                    <th className="text-center py-1 border-r border-black w-[15%] font-bold">Qtde</th>
                    <th className="text-left px-2 py-1 border-r border-black w-[25%] font-bold">Tipo</th>
                    <th className="text-left px-2 py-1 w-[60%] font-bold">Descrição</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {page.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300 last:border-black">
                      <td className="text-center py-2 border-r border-black align-top font-medium">{item.quantidade}</td>
                      <td className="px-2 py-2 border-r border-black align-top font-medium">{item.descricao}</td>
                      <td className="px-2 py-2 align-top">
                        <div className="font-normal">{item.detalhes || '-'}</div>
                      </td>
                    </tr>
                  ))}
                  {page.items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center italic text-gray-500">-- Continuação --</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {!page.isLast && (
                <div className="mt-2 text-right text-[9px] italic">Continua na próxima página...</div>
              )}
            </div>

            {/* RODAPÉ / RECIBO (só na última página) */}
            {page.isLast && (
              <footer className="mt-auto pt-2 px-2 pb-2">
                {guia.observacoes && (
                  <div className="mb-4 border border-black p-2 text-[10px]">
                    <div className="font-bold mb-1">OBSERVAÇÕES:</div>
                    <div className="whitespace-pre-wrap leading-tight">{guia.observacoes}</div>
                  </div>
                )}
                <div className="border border-black p-2">
                  <h3 className="text-center font-bold text-[11px] uppercase mb-4 bg-gray-100 border-b border-black -mx-2 -mt-2 py-1">
                    Recebimento
                  </h3>
                  <div className="space-y-3 text-[10px]">
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Nome:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Matrícula/RG:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Cargo:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                      <div className="w-10 font-bold shrink-0 text-right">Data:</div>
                      <div className="w-24 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end pt-2">
                      <div className="w-16 font-bold shrink-0">Assinatura:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
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
