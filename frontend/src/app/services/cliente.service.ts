import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private api = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    const u = this.auth.getUsuarioLogado();
    return new HttpHeaders({
      'X-Usuario-Id': u?.id?.toString() ?? '',
      'X-Usuario-Nome': u?.pessoa?.nome ?? u?.usuarioLogin ?? '',
    });
  }

  listar() {
    return this.http.get<Cliente[]>(this.api);
  }

  salvar(cliente: Cliente) {
    return this.http.post<Cliente>(this.api, cliente, { headers: this.headers() });
  }

  atualizar(id: number, cliente: Cliente) {
    return this.http.put<Cliente>(`${this.api}/${id}`, cliente, { headers: this.headers() });
  }

  excluir(id: number) {
    return this.http.delete(`${this.api}/${id}`, { headers: this.headers() });
  }
}
