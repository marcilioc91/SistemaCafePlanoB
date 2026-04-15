import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private api = "http://localhost:8080/clientes"

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Cliente[]>(this.api)
  }

  salvar(cliente: Cliente) {
    return this.http.post<Cliente>(this.api, cliente)
  }

  excluir(id: number) {
    return this.http.delete(`${this.api}/${id}`)
  }
}
