import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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

interface DadosConfirmacao {
  cliente: Cliente;
  itens: ItemCarrinho[];
  total: number;
}

// ── Diálogo de confirmação da venda ───────────────────────────────────────────
@Component({
  selector: 'app-venda-confirmacao-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './venda-confirmacao-dialog.html',
})
export class VendaConfirmacaoDialog {
  colunas = ['produto', 'qtd', 'subtotal'];
  formaPagamento = '';
  valorPago = 0;

  formas = [
    { valor: 'DINHEIRO', label: 'Dinheiro' },
    { valor: 'PIX', label: 'PIX' },
    { valor: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { valor: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { valor: 'PENDENTE', label: 'Deixar Pendente' },
  ];

  constructor(
    private dialogRef: MatDialogRef<VendaConfirmacaoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DadosConfirmacao
  ) {}

  confirmar() {
    const vPago = this.formaPagamento === 'PENDENTE' ? 0 : this.valorPago;
    this.dialogRef.close({ formaPagamento: this.formaPagamento, valorPago: vPago });
  }

  cancelar() { this.dialogRef.close(null); }
}

// ── Página de vendas ───────────────────────────────────────────────────────────
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
    MatAutocompleteModule,
    MatDialogModule,
  ],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas implements OnInit {
  produtos: any[] = [];
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  carrinho: ItemCarrinho[] = [];
  clienteSelecionado: Cliente | null = null;
  clienteSearchText = '';
  loading = true;

  colunasProdutos = ['nome', 'preco', 'estoque', 'acoes'];
  colunasCarrinho = ['produto', 'preco', 'quantidade', 'subtotal', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: res => {
        this.produtos = res;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
    this.clienteService.listar().subscribe({
      next: res => {
        this.clientes = res;
        this.filteredClientes = res;
      },
      error: () => this.snackBar.open('Erro ao carregar clientes.', 'Fechar', { duration: 3000 })
    });
  }

  filtrarClientes(valor: string) {
    const filtro = (valor ?? '').toLowerCase();
    this.filteredClientes = this.clientes.filter(c =>
      c.pessoa.nome.toLowerCase().includes(filtro)
    );
    if (!valor) this.clienteSelecionado = null;
  }

  onClienteSelecionado(event: MatAutocompleteSelectedEvent) {
    this.clienteSelecionado = this.clientes.find(c => c.pessoa.nome === event.option.value) ?? null;
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
    if (!this.clienteSelecionado.id || !usuario?.id) {
      this.snackBar.open('Erro ao processar cliente ou usuário.', 'Fechar', { duration: 3000 });
      return;
    }

    const ref = this.dialog.open(VendaConfirmacaoDialog, {
      width: '580px',
      data: {
        cliente: this.clienteSelecionado,
        itens: this.carrinho,
        total: this.total(),
      }
    });

    ref.afterClosed().subscribe((resultado: { formaPagamento: string; valorPago: number } | null) => {
      if (!resultado) return;

      const venda = {
        clienteId: this.clienteSelecionado!.id!,
        usuarioId: usuario.id,
        produtos: this.carrinho.map(i => ({
          produtoId: i.produto.id!,
          quantidade: i.quantidade
        })),
        formaPagamento: resultado.formaPagamento,
        valorPago: resultado.valorPago,
      };

      this.vendaService.realizarVenda(venda).subscribe({
        next: () => {
          const totalFormatado = this.total().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          this.snackBar.open(`Venda registrada! Total: ${totalFormatado}`, 'Fechar', { duration: 4000 });
          this.router.navigate(['/home']);
        },
        error: () => {
          this.snackBar.open('Erro ao registrar venda.', 'Fechar', { duration: 3000 });
        }
      });
    });
  }
}
