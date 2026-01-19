
import { Orgao, ServicoPreco, Operador, ResponsavelExterno } from '../types';

export const INITIAL_OPERADORES: Operador[] = [
  { id: '3', nome: 'Marcelo Queiroz' },
  { id: '8', nome: 'Oficina' },
  { id: '9', nome: 'Antonio Carlos' },
  { id: '11', nome: 'Júlio Navarro' },
  { id: '12', nome: 'Leandro Pereira' },
  { id: '13', nome: 'Hamilton' },
  { id: '14', nome: 'Roberto Ribeiro' },
  { id: '15', nome: 'João Pedro' }
];

export const INITIAL_RESPONSAVEIS: ResponsavelExterno[] = [
  { id: 'r1', nome: 'Rolliug de Assis' },
  { id: 'r2', nome: 'Leandro Pereira' },
  { id: 'r3', nome: 'Márcio Souza' },
  { id: 'r4', nome: 'Enéas Pereira' },
  { id: 'r5', nome: 'Valmir Marcante' },
  { id: 'r6', nome: 'Antonio Carlos Oliveira' },
  { id: 'r7', nome: 'André José de Carvalho' }
];

export const ORGAOS: Orgao[] = [
  {
    id: '44',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM DE CAMBUCI',
    comarca: 'Cambuci',
    forum: '',
    endereco: 'RUA: MARIA JACOB Nº 134, CENTRO',
    telefone: '',
    cep: '28430-000'
  },
  {
    id: '48',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Armação de Búzios',
    comarca: 'Armação de Búzios',
    forum: '',
    endereco: 'R Irmãos Araujo s/n - Centro',
    telefone: '',
    cep: '28950-725'
  },
  {
    id: '50',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Pinheiral',
    comarca: 'Pinheiral',
    forum: '',
    endereco: 'Rua José Breves, 344 - Centro',
    telefone: '',
    cep: '27197-000'
  },
  {
    id: '67',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Cachoeiras de Macacu',
    comarca: 'Cachoeiras de Macacu',
    forum: '',
    endereco: 'Rua: Dalmo Coelho Gomes, 01',
    telefone: '',
    cep: ''
  },
  {
    id: '68',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Niterói',
    comarca: 'Niterói',
    forum: '',
    endereco: 'Praça da República, s/nº - Térreo - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '76',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Nova Friburgo',
    comarca: 'Nova Friburgo',
    forum: '',
    endereco: 'Av. Euterpe Friburguense, 201 - Village',
    telefone: '',
    cep: '28605-130'
  },
  {
    id: '78',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Itaocara',
    comarca: 'Itaocara',
    forum: '',
    endereco: 'RUA JOAQUIM SOARES MONTEIRO 01 QUADRA A, LOTE 05 LOTEAMENTO RECREIO',
    telefone: '',
    cep: ''
  },
  {
    id: '91',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Cabo Frio',
    comarca: 'Cabo Frio',
    forum: '',
    endereco: 'Rua Ministro Gama Filho, S/N - Braga',
    telefone: '',
    cep: '28908-090'
  },
  {
    id: '144',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São Gonçalo',
    comarca: 'São Gonçalo',
    forum: '',
    endereco: 'Rua Getúlio Vargas, 2.512 - 2º Andar - Santa Catarina',
    telefone: '',
    cep: '24416-000'
  },
  {
    id: '150',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Duque de Caxias',
    comarca: 'Duque de Caxias',
    forum: '',
    endereco: 'Rua General Dionísio, 764, SALA 108, JARDIM 25 DE AGOSTO',
    telefone: '',
    cep: '25075-095'
  },
  {
    id: '158',
    sigla: 'DIFOR',
    nome: 'Divisão de Administração de Foro Central',
    comarca: 'Capital',
    forum: 'Central',
    endereco: 'Avenida Erasmo Braga, nº 115, sala 116, corredor C - Lâmina I',
    telefone: '(21) 3133-2000',
    cep: ''
  },
  {
    id: '164',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São Pedro da Aldeia',
    comarca: 'São Pedro da Aldeia',
    forum: '',
    endereco: 'Rua Antonio Benedito Siqueira, s/nº - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '204',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Saquarema',
    comarca: 'Saquarema',
    forum: '',
    endereco: 'R. Coronel Madureira s/n° centro',
    telefone: '',
    cep: '28990-000'
  },
  {
    id: '206',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Arraial do Cabo',
    comarca: 'Arraial do Cabo',
    forum: '',
    endereco: 'AV. ALMIRANTE PAULO MOREIRA nº 11 CENTRO',
    telefone: '',
    cep: '28930-000'
  },
  {
    id: '219',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Itaboraí',
    comarca: 'Itaboraí',
    forum: '',
    endereco: 'AV. VEREADOR HERMINIO MOREIRA - N° 380 - CENTRO',
    telefone: '',
    cep: ''
  },
  {
    id: '224',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum dos Juizados Especiais Cíveis e Varas Família de Niterói',
    comarca: 'Niterói',
    forum: '',
    endereco: 'Pça. Fonseca Ramos, s/nº - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '226',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Petrópolis',
    comarca: 'Petrópolis',
    forum: '',
    endereco: 'Av. Barão do Rio Branco, 2001 - 3º andar - Centro',
    telefone: '',
    cep: '25680-275'
  },
  {
    id: '243',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Japeri',
    comarca: 'Japeri',
    forum: '',
    endereco: 'Rua Vereador Francisco da Costa Filho - s/nº - Santa Inês',
    telefone: '',
    cep: '26400-000'
  },
  {
    id: '260',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Teresópolis',
    comarca: 'Teresópolis',
    forum: '',
    endereco: 'Rua Carmela Dutra, 678 - 4º andar, Agriões',
    telefone: '',
    cep: '25963-140'
  },
  {
    id: '265',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum dos Juizados Especiais de São Gonçalo',
    comarca: 'São Gonçalo',
    forum: '',
    endereco: 'Rua Dr. Francisco Portela, 2814 - Zé Garoto',
    telefone: '',
    cep: '24435-000'
  },
  {
    id: '269',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Rio Bonito',
    comarca: 'Rio Bonito',
    forum: '',
    endereco: 'AV. ANTONIO CARLOS DE SOUZA GUADALUPE, S/N° - GREEN VALLEY',
    telefone: '',
    cep: '28800-000'
  },
  {
    id: '275',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Vassouras',
    comarca: 'Vassouras',
    forum: '',
    endereco: 'Av. Marechal Paulo Torres, 731 - Madruga',
    telefone: '',
    cep: '27700-000'
  },
  {
    id: '276',
    sigla: 'DIFOR',
    nome: 'Direção do Forum de Macabu',
    comarca: 'Macabu',
    forum: '',
    endereco: 'Rua Feud Antonio, 08 - Centro - Conceição de Macabu',
    telefone: '',
    cep: '28740-000'
  },
  {
    id: '281',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Natividade',
    comarca: 'Natividade',
    forum: '',
    endereco: 'Rua Vigário João Batista, 14 - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '285',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Itaguaí',
    comarca: 'Itaguaí',
    forum: '',
    endereco: 'Rua General Bocaiúva, 424 - Centro',
    telefone: '',
    cep: '23815-310'
  },
  {
    id: '288',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Italva',
    comarca: 'Italva',
    forum: '',
    endereco: 'RUA: ARISTIDES GONÇALVES, 86, NOVA CIDADE',
    telefone: '',
    cep: '28250-000'
  },
  {
    id: '320',
    sigla: 'DIFOR',
    nome: 'Direção Fórum de Barra Mansa',
    comarca: 'Barra Mansa',
    forum: '',
    endereco: 'Av. Argemiro de Paula Coutinho, 2.000 - Barbará',
    telefone: '',
    cep: '27310-020'
  },
  {
    id: '359',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Macaé (ETIC)',
    comarca: 'Macaé',
    forum: '',
    endereco: 'Rod. do Petróleo, Km 04 - Virgem Santa',
    telefone: '',
    cep: '27948-010'
  },
  {
    id: '361',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Piraí',
    comarca: 'Piraí',
    forum: '',
    endereco: 'Rua Barão do Piraí, 322 - Centro',
    telefone: '',
    cep: '27175-000'
  },
  {
    id: '371',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Santo Antônio de Pádua',
    comarca: 'Santo Antônio de Pádua',
    forum: '',
    endereco: 'Praça Visconde de Figueira, s/nº - Centro',
    telefone: '',
    cep: '28470-000'
  },
  {
    id: '434',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Paracambi',
    comarca: 'Paracambi',
    forum: '',
    endereco: 'Rua Alberto Leal Cardoso, 92 - Centro',
    telefone: '',
    cep: '26600-000'
  },
  {
    id: '448',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM DE SÃO FIDÉLIS',
    comarca: 'Três Rios',
    forum: '',
    endereco: 'Praça da Justiça s/nº - Centro, São Fidélis',
    telefone: '',
    cep: '28400-000'
  },
  {
    id: '490',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Rio das Ostras',
    comarca: 'Rio das Ostras',
    forum: '',
    endereco: 'Al. Desembargador Ellis Hermydio Figueira, 1999 - Jardim Campomar',
    telefone: '',
    cep: '28890-000'
  },
  {
    id: '530',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São Francisco de Itabapoana',
    comarca: 'São Francisco de Itabapoana',
    forum: '',
    endereco: 'PRACA DOS TRES PODERES, S/N. - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '558',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Araruama',
    comarca: 'Araruama',
    forum: '',
    endereco: 'Av. Getúlio Vargas, 59 - Centro',
    telefone: '',
    cep: '28970-000'
  },
  {
    id: '564',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Paty do Alferes',
    comarca: 'Paty do Alferes',
    forum: '',
    endereco: 'Praça George Jacob Abdue, s/nº - Centro',
    telefone: '',
    cep: '26950-000'
  },
  {
    id: '567',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Seropédica',
    comarca: 'Seropédica',
    forum: '',
    endereco: 'RUA UBE 01 ANT EST RIO/SP KM47-UFRRJ - JARDIM SÃO JORGE',
    telefone: '',
    cep: ''
  },
  {
    id: '573',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Bom Jardim',
    comarca: 'Bom Jardim',
    forum: '',
    endereco: 'Pça. Gov. Roberto Silveira, 160 - Centro',
    telefone: '',
    cep: '28680-000'
  },
  {
    id: '580',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Resende (2ª VCRI)',
    comarca: 'Resende',
    forum: '',
    endereco: 'Av. Rita Maria Ferreira da Rocha, 517 Jardim Jalisco',
    telefone: '',
    cep: '27510-060'
  },
  {
    id: '591',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Itatiaia',
    comarca: 'Itatiaia',
    forum: '',
    endereco: 'Rua São José, 210 - Centro',
    telefone: '',
    cep: '27580-000'
  },
  {
    id: '595',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Belford Roxo',
    comarca: 'Belford Roxo',
    forum: '',
    endereco: 'Av. Joaquim da Costa Lima, s/n°, São Bernardo',
    telefone: '',
    cep: ''
  },
  {
    id: '622',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Sumidouro',
    comarca: 'Sumidouro',
    forum: '',
    endereco: 'Rua João Amâncio, 214 - Centro',
    telefone: '',
    cep: '28637-000'
  },
  {
    id: '624',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Rio Claro',
    comarca: 'Rio Claro',
    forum: '',
    endereco: 'Rua Manoel Portugal, 156 - Centro',
    telefone: '',
    cep: '27460-000'
  },
  {
    id: '625',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Duas Barras',
    comarca: 'Duas Barras',
    forum: '',
    endereco: 'Rua Modesto de Mello, 10 - Centro',
    telefone: '',
    cep: '28650-000'
  },
  {
    id: '639',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Maricá',
    comarca: 'Maricá',
    forum: '',
    endereco: 'Rua Jovino Duarte de Oliveira, s/nº - Araçatiba',
    telefone: '',
    cep: '24900-000'
  },
  {
    id: '651',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São João de Meriti',
    comarca: 'São João de Meriti',
    forum: '',
    endereco: 'Av. Pres. Lincoln, 857 - Vilar dos Teles',
    telefone: '',
    cep: '25599-900'
  },
  {
    id: '656',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Porto Real-Quatis',
    comarca: 'Porto Real-Quatis',
    forum: '',
    endereco: 'Rua Hilário Ettore, 378 - Centro - Porto Real',
    telefone: '',
    cep: ''
  },
  {
    id: '683',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Itaperuna',
    comarca: 'Itaperuna',
    forum: '',
    endereco: 'Rodovia BR 356, Km 01',
    telefone: '',
    cep: ''
  },
  {
    id: '689',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Três Rios',
    comarca: 'Três Rios',
    forum: '',
    endereco: 'Av. Tenente Enéas Torno, 42 - Centro',
    telefone: '',
    cep: '25802-330'
  },
  {
    id: '692',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Santa Maria Madalena',
    comarca: 'Santa Maria Madalena',
    forum: '',
    endereco: 'RUA IZAMOR NOVAES DE SÁ 03 - CENTRO',
    telefone: '',
    cep: ''
  },
  {
    id: '718',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Cantagalo',
    comarca: 'Cantagalo',
    forum: '',
    endereco: 'Praça João XXIII, 256 - Centro',
    telefone: '',
    cep: '28500-000'
  },
  {
    id: '721',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São Sebastião do Alto',
    comarca: 'São Sebastião do Alto',
    forum: '',
    endereco: 'Praça Dr. Hermes Ferro, 88 - Centro',
    telefone: '',
    cep: '28550-000'
  },
  {
    id: '725',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Mendes',
    comarca: 'Mendes',
    forum: '',
    endereco: 'Rua Alberto Torres, 114 - Centro',
    telefone: '',
    cep: '26700-000'
  },
  {
    id: '726',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Paraíba do Sul',
    comarca: 'Paraíba do Sul',
    forum: '',
    endereco: 'Rua Alfredo da Costa Mattos Jr., 64 - Centro',
    telefone: '',
    cep: '25850-000'
  },
  {
    id: '730',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Mangaratiba',
    comarca: 'Mangaratiba',
    forum: '',
    endereco: 'ESTRADA SAO JOAO MARCOS S/N / 2 ANDAR EL RANCHITO',
    telefone: '',
    cep: ''
  },
  {
    id: '765',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Rio das Flores',
    comarca: 'Rio das Flores',
    forum: '',
    endereco: 'Rua João Carvalho da Rocha, s/nº - Centro',
    telefone: '',
    cep: '27660-000'
  },
  {
    id: '783',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Lage do Muriaé',
    comarca: 'Lage do Muriaé',
    forum: '',
    endereco: 'Rua Ferreira César, 480 - Centro',
    telefone: '',
    cep: '28350-000'
  },
  {
    id: '786',
    sigla: 'DIFOR',
    nome: 'VARA ÚNICA DE CASIMIRO DE ABREU',
    comarca: 'Casimiro de Abreu',
    forum: '',
    endereco: 'Rua Waldemir Henriger da Silva, 600 - Sociedade Fluminense',
    telefone: '',
    cep: ''
  },
  {
    id: '788',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Iguaba Grande',
    comarca: 'Iguaba',
    forum: '',
    endereco: 'Rua Engenheiro da Rocha S/n - Cidade Nova',
    telefone: '',
    cep: ''
  },
  {
    id: '789',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Engenheiro Paulo de Frontin',
    comarca: 'Engenheiro Paulo de Frontin',
    forum: '',
    endereco: 'Rodovia Luciano Medeiros, 568 - Centro',
    telefone: '',
    cep: '26650-000'
  },
  {
    id: '792',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Porciúncula',
    comarca: 'Porciúncula',
    forum: '',
    endereco: 'Praça José Berardinelli Vieira, 1 - Centro',
    telefone: '',
    cep: '28390-000'
  },
  {
    id: '793',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Barra do Piraí',
    comarca: 'Barra do Piraí',
    forum: '',
    endereco: 'Rua Professor José Antônio Maia Vinagre, 155 - Matadouro',
    telefone: '',
    cep: '27115-090'
  },
  {
    id: '911',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Bom Jesus de Itabapoana',
    comarca: 'Bom Jesus de Itabapoana',
    forum: '',
    endereco: 'Av. Olímpica, 478 - Centro',
    telefone: '',
    cep: '28360-000'
  },
  {
    id: '935',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de São José do Vale do Rio Preto',
    comarca: 'São José do Vale do Rio Preto',
    forum: '',
    endereco: 'Rua Senhor dos Passos, 37 - Largo da Matriz - Centro',
    telefone: '',
    cep: '25780-000'
  },
  {
    id: '937',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Paraty',
    comarca: 'Paraty',
    forum: '',
    endereco: 'Trav. Santa Rita, 18 - Centro',
    telefone: '',
    cep: '23970-000'
  },
  {
    id: '938',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Queimados',
    comarca: 'Queimados',
    forum: '',
    endereco: 'Rua Otília, 210 - Centro',
    telefone: '',
    cep: '26383-290'
  },
  {
    id: '955',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Miracema',
    comarca: 'Miracema',
    forum: '',
    endereco: 'Av. Dep. Luiz Fernando Linhares, 1020 - 2 Pavimento - Boa Vista',
    telefone: '',
    cep: ''
  },
  {
    id: '959',
    sigla: 'DIFOR',
    nome: 'Juizado da Infância e da Juventude',
    comarca: 'Valença',
    forum: '',
    endereco: 'Rua Araújo Leite, 166 - Centro',
    telefone: '',
    cep: ''
  },
  {
    id: '1074',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Magé',
    comarca: 'Vila de Inhomirim',
    forum: '',
    endereco: 'Rua Domigos Bellizze 178 Magé - Centro',
    telefone: '',
    cep: '25900-000'
  },
  {
    id: '1142',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Nova Iguaçu',
    comarca: 'Nova Iguaçu',
    forum: '',
    endereco: 'Rua Dr. Mario Guimarães, 968 - Bairro da Luz',
    telefone: '',
    cep: '26255-230'
  },
  {
    id: '1262',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Carapebus-Quissamã',
    comarca: 'Carapebus-Quissamã',
    forum: '',
    endereco: 'Estrada do Correio Imperial, 1003 - Piteiras',
    telefone: '',
    cep: '28735-000'
  },
  {
    id: '1465',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum de Quissamã',
    comarca: 'Quissamã',
    forum: '',
    endereco: 'Estrada do Correio Imperial, 1033 - Piteiras',
    telefone: '',
    cep: '28735-000'
  },
  {
    id: '1507',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FORUM REGIONAL BANGU',
    comarca: 'Bangu',
    forum: '',
    endereco: 'Rua Doze de Fevereiro, s/nº',
    telefone: '',
    cep: '21810-052'
  },
  {
    id: '1820',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum Regional da Ilha do Governador',
    comarca: 'Capital',
    forum: '',
    endereco: 'Praia de Olaria, S/Nº, Aterro do Cocotá',
    telefone: '',
    cep: '21910-295'
  },
  {
    id: '2294',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM MAGÉ',
    comarca: 'Forum Central',
    forum: 'Magé',
    endereco: 'AVENIDA SANTOS DUMONT - S/Nº - PARQUE SANTANA',
    telefone: '',
    cep: ''
  },
  {
    id: '2373',
    sigla: 'DIFOR',
    nome: 'FÓRUM REGIONAL DE ITAIPAVA',
    comarca: 'ITAIPAVA',
    forum: 'ITAIPAVA',
    endereco: 'ESTRADA UNIÃO E INDUSTRIA 9.900 SALA 321 ITAIPAVA',
    telefone: '',
    cep: ''
  },
  {
    id: '2381',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM DE MIGUEL PEREIRA',
    comarca: 'MIGUEL PEREIRA',
    forum: 'MIGUEL PEREIRA',
    endereco: 'RUA FRANCISCO ALVES, 105 SALA 10 CENTRO',
    telefone: '',
    cep: ''
  },
  {
    id: '2416',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM DA BARRA DA TIJUCA',
    comarca: 'BARRA DA TIJUCA',
    forum: 'BARRA DA TIJUCA',
    endereco: 'AV. LUIZ CARLOS PRESTES, S/Nº TERREO',
    telefone: '',
    cep: ''
  },
  {
    id: '2583',
    sigla: 'DIFOR',
    nome: 'DIREÇÃO DO FÓRUM DE JACAREPAGUÁ',
    comarca: 'Capital',
    forum: 'Jacarepaguá',
    endereco: 'Rua: Professora Francisca Piragibe, nº 80, sala 208, Taquara',
    telefone: '',
    cep: '22710-195'
  },
  {
    id: '2594',
    sigla: 'DIFOR',
    nome: 'Fórum Desembargador Abaylard Pereira Gomes',
    comarca: 'Volta Redonda',
    forum: 'Volta Redonda',
    endereco: 'R. Desembargador Ellis Ermydio Figueira S/n, Aterrado',
    telefone: '',
    cep: '27213-145'
  },
  {
    id: '2633',
    sigla: 'DIFOR',
    nome: 'Direção do Fórum Angra dos Reis',
    comarca: 'Angra dos Reis',
    forum: 'Angra dos Reis',
    endereco: 'Av. Oswaldo Neves Martins, 32',
    telefone: '',
    cep: ''
  },
  {
    id: '2662',
    sigla: 'DIFOR',
    nome: 'Divisão de Administração de Foro Central (2662)',
    comarca: 'Capital',
    forum: 'Central',
    endereco: 'Av. Erasmo Braga, 115 - Lâmina I, Corredor C, sala 116',
    telefone: '',
    cep: ''
  },
  {
    id: '2038',
    sigla: 'PROGER',
    nome: 'Protocolo Geral de Iguaba Grande',
    comarca: 'Iguaba Grande',
    forum: '',
    endereco: 'AV. PAULINO RODRIGUES DE SOUZA 2001 - CENTRO',
    telefone: '',
    cep: '28960-000'
  },
  {
    id: '2077',
    sigla: 'JEC',
    nome: 'JUIZADO ESPECIAL ADJUNTO CIVEL',
    comarca: 'IGUABA GRANDE',
    forum: '',
    endereco: 'AV. PAULO RODRIGUES DE SOUZA N° 2001 - CENTRO',
    telefone: '',
    cep: ''
  },
  {
    id: '2412',
    sigla: 'COMISSARIADO',
    nome: 'COMISSARIADO DE JUSTIÇA DA INFANCIA, JUVENTUDE E IDOSO',
    comarca: 'IGUABA GRANDE',
    forum: 'IGUABA GRANDE',
    endereco: 'R. ENGENHEIRO NEVES DA ROCHA, S/N, CIDADE NOVA',
    telefone: '',
    cep: '28960-000'
  }
];

export const INITIAL_SERVICOS: ServicoPreco[] = [
  // Programação
  { id: 'p1', descricao: 'CARTAZ', categoria: 'Programacao', valorUnitario: 0.00 },
  { id: 'p2', descricao: 'CARTÃO DE VISITA', categoria: 'Programacao', valorUnitario: 0.50 },
  { id: 'p3', descricao: 'CARTÃO DE GABINETE', categoria: 'Programacao', valorUnitario: 0.40 },
  { id: 'p4', descricao: 'CONVITE', categoria: 'Programacao', valorUnitario: 1.50 },
  { id: 'p5', descricao: 'FOLHETO', categoria: 'Programacao', valorUnitario: 0.80 },
  { id: 'p6', descricao: 'CRACHÁ', categoria: 'Programacao', valorUnitario: 5.00 },
  { id: 'p7', descricao: 'CARTEIRINHA', categoria: 'Programacao', valorUnitario: 2.50 },
  { id: 'p8', descricao: 'CARTILHA', categoria: 'Programacao', valorUnitario: 15.00 },
  { id: 'p9', descricao: 'LIVRO', categoria: 'Programacao', valorUnitario: 45.00 },
  { id: 'p10', descricao: 'REVISTA', categoria: 'Programacao', valorUnitario: 25.00 },
  { id: 'p11', descricao: 'JORNAL', categoria: 'Programacao', valorUnitario: 3.00 },
  { id: 'p12', descricao: 'PRISMA', categoria: 'Programacao', valorUnitario: 4.00 },
  { id: 'p13', descricao: 'CAPA', categoria: 'Programacao', valorUnitario: 10.00 },
  { id: 'p14', descricao: 'LOGOTIPO', categoria: 'Programacao', valorUnitario: 150.00 },
  { id: 'p15', descricao: 'FOLHAS AVULSAS', categoria: 'Programacao', valorUnitario: 0.20 },
  { id: 'p16', descricao: 'PAPEL TIMBRADO', categoria: 'Programacao', valorUnitario: 0.30 },
  
  // Sinalização
  { id: 's1', descricao: 'PLACA EXTERNA', categoria: 'Sinalizacao', valorUnitario: 120.00 },
  { id: 's2', descricao: 'PLACA INTERNA', categoria: 'Sinalizacao', valorUnitario: 80.00 },
  { id: 's3', descricao: 'PLACA DE PAVIMENTO', categoria: 'Sinalizacao', valorUnitario: 90.00 },
  { id: 's4', descricao: 'BANDEIRA', categoria: 'Sinalizacao', valorUnitario: 150.00 },
  { id: 's5', descricao: 'FAIXA', categoria: 'Sinalizacao', valorUnitario: 70.00 },
  { id: 's6', descricao: 'ADESIVO', categoria: 'Sinalizacao', valorUnitario: 35.00 },
  { id: 's7', descricao: 'AVISO', categoria: 'Sinalizacao', valorUnitario: 20.00 },
  { id: 's8', descricao: 'DISPLAY DE MESA', categoria: 'Sinalizacao', valorUnitario: 45.00 },
  { id: 's9', descricao: 'ETIQUETA', categoria: 'Sinalizacao', valorUnitario: 0.50 },
  { id: 's10', descricao: 'PAINEL', categoria: 'Sinalizacao', valorUnitario: 300.00 },
  { id: 's11', descricao: 'PLACA ESPECIAL', categoria: 'Sinalizacao', valorUnitario: 200.00 },
  { id: 's12', descricao: 'PLACA INFORMATIVA', categoria: 'Sinalizacao', valorUnitario: 60.00 },
  { id: 's13', descricao: 'PLACA INDICATIVA', categoria: 'Sinalizacao', valorUnitario: 60.00 },
  { id: 's14', descricao: 'TRIÂNGULO EXTERNO', categoria: 'Sinalizacao', valorUnitario: 110.00 },
  { id: 's15', descricao: 'COLUNA DE IDENTIFICAÇÃO', categoria: 'Sinalizacao', valorUnitario: 180.00 },
  { id: 's16', descricao: 'Placa em Vinil 21x38', categoria: 'Sinalizacao', valorUnitario: 45.00 },
  { id: 's17', descricao: 'Placa em Vinil 15x30', categoria: 'Sinalizacao', valorUnitario: 30.00 },

  // Impressão (Extras)
  { id: 'i1', descricao: 'Cópia Colorida', categoria: 'Impressao', valorUnitario: 1.50 },
  { id: 'i2', descricao: 'Impressão Digital', categoria: 'Impressao', valorUnitario: 2.00 },
];
