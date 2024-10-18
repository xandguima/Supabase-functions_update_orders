
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
    pedido: Pedido
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


export interface ResponseApiTinyObterPedidosError {
  retorno: {
    status_processamento: string;
    erros: Array<{ erro: string }>;
  };
}