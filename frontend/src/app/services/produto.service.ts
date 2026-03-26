import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private api = "http://localhost:8080/produtos"

  constructor(private http: HttpClient) {}

  listar(){
    return this.http.get(this.api)
  }

  salvar(produto:any){
    return this.http.post(this.api, produto)
  }
}
