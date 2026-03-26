import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produtos',
  imports: [],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  produtos: Produto[] = []

  constructor(private service: ProdutoService) {}

  ngOnInit(): void {
    this.service.listar().subscribe((res:any) => {
      this.produtos = res
    })
  }
}
