import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendas',
  imports: [CommonModule],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas implements OnInit {
  produtos: Produto[] = []
  itens: any[] = []

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ){}

  ngOnInit(): void {
    this.produtoService.listar().subscribe((res:any) => {
      this.produtos = res
    })
  }

  adicionar(produto: Produto){
    this.itens.push({
      produtoId: produto.id,
      quantidade: 1
    })
  }

  finalizar(){
    const venda = {
      clienteId: 1,
      usuarioId: 1,
      produtos: this.itens
    }

    this.vendaService.realizarVenda(venda).subscribe(() => {
      alert("Venda realizada!")
    })
  }
}
