import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/usuario';

export interface CadastroRequest {
  nome: string;
  cpf?: string;
  email: string;
  telefone?: string;
  usuario: string;
  senha: string;
  obs?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = "http://localhost:8080/auth"

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest) {
    return this.http.post(this.api + "/login", loginRequest)
  }

  cadastrar(dados: CadastroRequest) {
    return this.http.post(this.api + "/cadastro", dados)
  }

  setUsuarioLogado(usuario: any) {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioLogado(): any {
    const u = sessionStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }

  logout() {
    sessionStorage.removeItem('usuario');
  }
}
