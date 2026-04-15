import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venda, VendaResposta } from '../models/venda';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private api = "http://localhost:8080/vendas"

  constructor(private http: HttpClient) {}

  realizarVenda(venda: Venda) {
    return this.http.post(this.api, venda)
  }

  listarTodas() {
    return this.http.get<VendaResposta[]>(this.api)
  }

  listarPorCliente(clienteId: number) {
    return this.http.get<VendaResposta[]>(`${this.api}/cliente/${clienteId}`)
  }
}
