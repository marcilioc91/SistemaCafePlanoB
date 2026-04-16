import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Produto } from '../../models/produto';
import { Cliente } from '../../models/cliente';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
  ],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas implements OnInit {
  produtos: Produto[] = [];
  clientes: Cliente[] = [];
  carrinho: ItemCarrinho[] = [];
  clienteSelecionado: Cliente | null = null;

  colunasProdutos = ['nome', 'preco', 'estoque', 'acoes'];
  colunasCarrinho = ['produto', 'preco', 'quantidade', 'subtotal', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe(res => this.produtos = res);
    this.clienteService.listar().subscribe(res => this.clientes = res);
  }

  adicionar(produto: Produto) {
    const item = this.carrinho.find(i => i.produto.id === produto.id);
    if (item) {
      item.quantidade++;
    } else {
      this.carrinho = [...this.carrinho, { produto, quantidade: 1 }];
    }
  }

  remover(produto: Produto) {
    this.carrinho = this.carrinho.filter(i => i.produto.id !== produto.id);
  }

  total(): number {
    return this.carrinho.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  }

  finalizar() {
    if (!this.clienteSelecionado) {
      this.snackBar.open('Selecione um cliente para continuar.', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.carrinho.length === 0) {
      this.snackBar.open('Adicione pelo menos um produto ao carrinho.', 'Fechar', { duration: 3000 });
      return;
    }

    const usuario = this.auth.getUsuarioLogado();
    const totalVenda = this.total();

    if (!this.clienteSelecionado.id || !usuario?.id) {
      this.snackBar.open('Erro ao processar cliente ou usuário.', 'Fechar', { duration: 3000 });
      return;
    }

    const venda = {
      clienteId: this.clienteSelecionado.id,
      usuarioId: usuario.id,
      produtos: this.carrinho.map(i => ({
        produtoId: i.produto.id!,
        quantidade: i.quantidade
      }))
    };

    this.vendaService.realizarVenda(venda).subscribe({
      next: () => {
        const totalFormatado = totalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.snackBar.open(`Venda registrada! Total: ${totalFormatado}`, 'Fechar', { duration: 6000 });
        this.carrinho = [];
        this.clienteSelecionado = null;
        this.produtoService.listar().subscribe(res => this.produtos = res);
      },
      error: () => {
        this.snackBar.open('Erro ao registrar venda.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
