import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { VendaResposta } from '../../models/venda';
import { VendaService } from '../../services/venda.service';

interface GrupoCliente {
  clienteId: number;
  nomeCliente: string;
  totalGasto: number;
  totalPendente: number;
  totalCredito: number;
  totalPago: number;
  vendas: VendaResposta[];
}

// ── Diálogo de edição de pagamento ────────────────────────────────────────────
@Component({
  selector: 'app-pagamento-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './pagamento-dialog.html',
})
export class PagamentoDialog {
  formaPagamento: string;
  valorPago: number;
  erro = '';

  formas = [
    { valor: 'DINHEIRO', label: 'Dinheiro' },
    { valor: 'PIX', label: 'PIX' },
    { valor: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { valor: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { valor: 'VOUCHER', label: 'Voucher' },
    { valor: 'PENDENTE', label: 'Deixar Pendente' }
  ];

  constructor(
    private dialogRef: MatDialogRef<PagamentoDialog>,
    private vendaService: VendaService,
    @Inject(MAT_DIALOG_DATA) public data: { venda: VendaResposta; total: number }
  ) {
    this.formaPagamento = data.venda.formaPagamento ?? '';
    this.valorPago = data.venda.valorPago ?? 0;
  }

  salvar() {
    const valorFinal = this.formaPagamento === 'PENDENTE' ? 0 : this.valorPago;
    this.vendaService.atualizarPagamento(this.data.venda.id, {
      formaPagamento: this.formaPagamento,
      valorPago: valorFinal,
    }).subscribe({
      next: () => this.dialogRef.close({ formaPagamento: this.formaPagamento, valorPago: valorFinal }),
      error: () => { this.erro = 'Erro ao salvar pagamento.'; }
    });
  }

  cancelar() { this.dialogRef.close(null); }
}

// ── Página de histórico ───────────────────────────────────────────────────────
@Component({
  selector: 'app-historico-vendas',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './historico-vendas.html',
  styleUrl: './historico-vendas.css',
})
export class HistoricoVendas implements OnInit {
  grupos: GrupoCliente[] = [];
  carregando = true;
  colunasItens = ['produto', 'quantidade', 'precoUnitario', 'subtotal'];

  constructor(
    private vendaService: VendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.vendaService.listarTodas().subscribe({
      next: vendas => {
        this.grupos = this.agruparPorCliente(vendas);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.grupos = [];
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private agruparPorCliente(vendas: VendaResposta[]): GrupoCliente[] {
    const mapa = new Map<number, GrupoCliente>();
    for (const venda of vendas) {
      const id = venda.cliente.id;
      if (!mapa.has(id)) {
        mapa.set(id, {
          clienteId: id,
          nomeCliente: venda.cliente.pessoa.nome,
          totalGasto: 0,
          totalPendente: 0,
          totalCredito: 0,
          totalPago: 0,

          vendas: [],
        });
      }
      const grupo = mapa.get(id)!;
      grupo.vendas.push(venda);
      grupo.totalGasto += this.totalVenda(venda);
      grupo.totalPago += venda.valorPago ?? 0;
      if (venda.formaPagamento === 'PENDENTE' || (venda.valorPago ?? 0) < this.totalVenda(venda)) {
        grupo.totalPendente += (this.totalVenda(venda) - (venda.valorPago ?? 0));
      }
    }

    for (const grupo of mapa.values()) {
      if (grupo.totalPago > grupo.totalGasto) {
        grupo.totalCredito = Math.max(0, grupo.totalPago - grupo.totalGasto);
      }

    }

    return Array.from(mapa.values())
      .sort((a, b) => b.totalGasto - a.totalGasto);
  }

  totalVenda(venda: VendaResposta): number {
    return venda.itens?.reduce((acc, i) => acc + i.quantidade * +i.precoUnitario, 0) ?? 0;
  }

  labelPagamento(forma: string): string {
    const mapa: Record<string, string> = {
      DINHEIRO: 'Dinheiro',
      PIX: 'PIX',
      CARTAO_CREDITO: 'Cartão de Crédito',
      CARTAO_DEBITO: 'Cartão de Débito',
      PENDENTE: 'Pendente',
    };
    return mapa[forma] ?? forma ?? '—';
  }

  abrirEdicaoPagamento(venda: VendaResposta) {
    const ref = this.dialog.open(PagamentoDialog, {
      width: '420px',
      data: { venda, total: this.totalVenda(venda) }
    });
    ref.afterClosed().subscribe((resultado: { formaPagamento: string; valorPago: number } | null) => {
      if (!resultado) return;
      venda.formaPagamento = resultado.formaPagamento;
      venda.valorPago = resultado.valorPago;
      this.carregar();
      this.snackBar.open('Pagamento atualizado!', 'Fechar', { duration: 3000 });
    });
  }
}
