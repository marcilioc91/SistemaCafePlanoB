import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RelatorioInventarioItem, Venda, VendaResposta } from '../models/venda';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private api = 'http://localhost:8080/vendas';

  constructor(private http: HttpClient, private auth: AuthService) {}

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
    const perfil = this.auth.getUsuarioLogado()?.perfil ?? '';
    const headers = new HttpHeaders({ 'X-Usuario-Perfil': perfil });
    return this.http.get<RelatorioInventarioItem[]>(`${this.api}/relatorio/inventario`, { headers });
  }
}
