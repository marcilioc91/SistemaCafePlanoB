export interface VendaProduto {
  produtoId: number
  quantidade: number
}

export interface Venda {
  clienteId: number
  usuarioCpf: string
  produtos: VendaProduto[]
}