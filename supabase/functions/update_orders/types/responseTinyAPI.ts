export interface Pedido {
  id: number;
  numero: number;
  data_pedido: Date;
  data_prevista: Date;
  cliente: {
    nome: string;
    codigo: number;
    nome_fantasia: string | null;
    cpf_cnpj: number;
  };
  itens: Array<{ item: ItemDetalhe }>;
  marcadores: Array<{ marcador: Marcadores }>;
  total_pedido: number;
  situacao: string;
  obs: string;
  id_vendedor: number;
}
export interface ResponseApiTinyObterPedido {
  retorno: {
    status_processamento: string;
    pedido: Pedido;
  };
}

export interface ItemDetalhe {
  id_produto: string;
  codigo: number;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_unitario: number;
}

interface Marcadores {
  id: number;
  descricao: string;
  cor: string;
}

export interface ResponseApiTinyError {
  retorno: {
    status_processamento: string;
    erros: Array<{ erro: string }>;
  };
}

export interface ResponseApiTinyPesquisaVendedores {
  retorno: {
    status_processamento: number;
    status: string;
    pagina: string;
    numero_pagina: string;
    vendedores: Array<{ vendedor: Vendedor }>;
  };
}

export interface Vendedor {
  id: number;
  codigo: number;
  nome: string;
  tipo_pessoa: string;
  fantasia: string;
  cpf_cnpj: string;
  email: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  situacao: string;
}

export interface ResponseAPIObterProduto {
  retorno: {
    status_processamento: number;
    status: string;
    pagina: string;
    numero_pagina: string;
    produtos: Array<{ produto: Produto }>;
  };
}
export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  preco: number;
  preco_promocional: number;
  ncm: string;
  origem: string;
  gtin: string;
  gtin_embalagem: string;
  localizacao: string;
  peso_liquido: number;
  peso_bruto: number;
  estoque_minimo: number;
  estoque_maximo: number;
  id_fornecedor: number;
  codigo_fornecedor: string;
  codigo_pelo_fornecedor: string;
  unidade_por_caixa: string;
  preco_custo: number;
  preco_custo_medio: number;
  situacao: string;
  tipo: string;
  classe_ipi: string;
  valor_ipi_fixo: string;
  cod_lista_servicos: string;
  descricao_complementar: string;
  obs: string;
  garantia: string;
  cest: string;
  tipoVariacao: string;
  variacoes: Array<{ variacao: Variacao }>;
  idProdutoPai: string;
  sob_encomenda: string;
  marca: string;
  tipoEmbalagem: string;
  alturaEmbalagem: string;
  comprimentoEmbalagem: string;
  larguraEmbalagem: string;
  diametroEmbalagem: string;
  categoria: string;
  anexos: Array<{ anexo: string }>;
  imagens_externas: Array<{ imagem_externa: ImagemExterna }>;
  classe_produto: string;
}

export interface ImagemExterna {
  url: string;
}

export interface Variacao {
  id:string,
  codigo: string,
  preco:string,
  grade: {
    Tamanho: string,
    Cor: string
  }
}