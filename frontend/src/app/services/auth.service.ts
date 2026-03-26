import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = "http://localhost:8080/auth"

  constructor(private http: HttpClient) {}
  login(usuario: Usuario){
    return this.http.post(this.api + "/login", usuario)
  }
}
