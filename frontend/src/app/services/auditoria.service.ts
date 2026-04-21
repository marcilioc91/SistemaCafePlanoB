import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuditoriaLog } from '../models/auditoria';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private api = 'http://localhost:8080/auditoria';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<AuditoriaLog[]>(this.api);
  }

  listarPorUsuario(usuarioId: number) {
    return this.http.get<AuditoriaLog[]>(`${this.api}?usuarioId=${usuarioId}`);
  }
}
