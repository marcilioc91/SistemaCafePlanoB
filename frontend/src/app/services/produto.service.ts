import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private api = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Produto[]>(this.api);
  }

  salvar(produto: Produto) {
    return this.http.post<Produto>(this.api, produto);
  }

  atualizar(id: number, produto: Produto) {
    return this.http.put<Produto>(`${this.api}/${id}`, produto);
  }

  excluir(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
