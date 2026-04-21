import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos',
  imports: [],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  produtos: Produto[] = []

  constructor(
    private service: ProdutoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.router.events.subscribe(() => {
      this.carregar();
    });
  }
  carregar() {
    this.service.listar().subscribe((res:any) => {
      this.produtos = res;
    })
  }
}
