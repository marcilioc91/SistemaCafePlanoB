export interface VendaProduto {
  produtoId: number;
  quantidade: number;
}

export interface Venda {
  clienteId: number;
  usuarioId: number;
  produtos: VendaProduto[];
}
