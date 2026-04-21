import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RelatorioInventarioItem, Venda, VendaResposta } from '../models/venda';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private api = 'http://localhost:8080/vendas';

  constructor(private http: HttpClient) {}

  realizarVenda(venda: Venda) {
    return this.http.post(this.api, venda);
  }

  listarTodas() {
    return this.http.get<VendaResposta[]>(this.api);
  }

  listarPorCliente(clienteId: number) {
    return this.http.get<VendaResposta[]>(`${this.api}/cliente/${clienteId}`);
  }

  atualizarPagamento(id: number, dados: { formaPagamento: string; valorPago: number }) {
    return this.http.patch(`${this.api}/${id}/pagamento`, dados);
  }

  getRelatorioInventario() {
    return this.http.get<RelatorioInventarioItem[]>(`${this.api}/relatorio/inventario`);
  }
}
