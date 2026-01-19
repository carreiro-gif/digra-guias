
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { INITIAL_SERVICOS } from '../data/mockData';
import { DraftGuideParams, Guia, Orgao } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const draftGuideTool: FunctionDeclaration = {
  name: "draftGuide",
  description: "Draft a new delivery note (guia) by finding the organization and services requested.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      orgaoQuery: {
        type: Type.STRING,
        description: "The name or acronym of the organization (Orgão) requesting the service.",
      },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            servicoQuery: { type: Type.STRING, description: "Description of the service or item." },
            quantidade: { type: Type.NUMBER, description: "Quantity of the item." },
            detalhes: { type: Type.STRING, description: "Extra details like dimensions, color, specific content (e.g. 'Gabinetes para Juiz')." }
          }
        }
      },
      solicitante: { type: Type.STRING, description: "Name of the person requesting." }
    },
    required: ["orgaoQuery", "items"]
  }
};

const listOrgsTool: FunctionDeclaration = {
  name: "listOrgs",
  description: "List available organizations based on a filter.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      comarca: { type: Type.STRING, description: "Filter by district (comarca)." },
    }
  }
};

export const createSystemInstruction = (guiasContext: Guia[], orgaosContext: Orgao[]) => `
  Você é o assistente inteligente do sistema DIGRA (Divisão Gráfica) do PJERJ.
  Sua função é ajudar servidores a emitir guias de remessa, consultar informações técnicas e analisar dados históricos.

  DADOS DISPONÍVEIS:
  1. Lista de Serviços e Preços: ${JSON.stringify(INITIAL_SERVICOS.map(s => ({ nome: s.descricao, cat: s.categoria, valor: s.valorUnitario })))}
  2. Órgãos Cadastrados (Atual): ${JSON.stringify(orgaosContext.map(o => `${o.sigla} - ${o.nome} (${o.comarca})`))}
  3. Histórico de Guias Atual: ${JSON.stringify(guiasContext.map(g => ({
      data: g.dataEmissao,
      orgao: g.orgaoSnapshot.sigla,
      itens: g.itens.map(i => ({ servico: i.descricao, qtd: i.quantidade }))
  })))}

  REGRAS:
  - Se o usuário pedir para criar/emitir uma guia, use a tool 'draftGuide'. Identifique os itens e detalhes. Ex: "Placa em Vinil" é o serviço, "21x38" entra em detalhes.
  - Ao usar 'draftGuide', tente encontrar o nome mais próximo possível do Órgão na lista "Órgãos Cadastrados".
  - Se o usuário pedir análises (ex: "Média de valor", "Relatório do mês", "Mais solicitados"), calcule com base no "Histórico de Guias Atual" fornecido acima e responda em texto/tabela markdown.
  - Para perguntas de valor unitário, consulte a lista de serviços.
  - Sempre responda de forma cordial e profissional, padrão Judiciário.
`;

export const sendMessageToGemini = async (
  message: string,
  currentGuias: Guia[],
  currentOrgaos: Orgao[],
  onDraftGuide: (params: DraftGuideParams) => void
): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada.";

  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction: createSystemInstruction(currentGuias, currentOrgaos),
        tools: [{ functionDeclarations: [draftGuideTool, listOrgsTool] }],
        temperature: 0.1
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) return "Não entendi o pedido.";

    const content = candidates[0].content;
    const parts = content.parts;

    let textResponse = "";

    for (const part of parts) {
      if (part.text) {
        textResponse += part.text;
      }
      
      if (part.functionCall) {
        const fc = part.functionCall;
        
        if (fc.name === 'draftGuide') {
          const args = fc.args as unknown as DraftGuideParams;
          onDraftGuide(args);
          return `Entendido. Preparei um rascunho de guia para "${args.orgaoQuery}" com ${args.items.length} itens. Verifique o formulário.`;
        }
        
        if (fc.name === 'listOrgs') {
           const args = fc.args as any;
           const filter = args.comarca ? args.comarca.toLowerCase() : '';
           const filtered = currentOrgaos.filter(o => !filter || o.comarca.toLowerCase().includes(filter));
           return `Encontrei ${filtered.length} órgãos${filter ? ` na comarca ${args.comarca}` : ''}: \n${filtered.map(o => `- ${o.nome} (${o.sigla})`).join('\n')}`;
        }
      }
    }

    return textResponse || "Processado.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, ocorreu um erro ao processar sua solicitação com a IA.";
  }
};
