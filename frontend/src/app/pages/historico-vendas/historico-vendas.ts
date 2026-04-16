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
  vendas: VendaResposta[];
}

// ── Diálogo de edição de pagamento ────────────────────────────────────────────
@Component({
  selector: 'app-pagamento-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  template: `
    <h2 style="padding: 24px 24px 0">Registrar Pagamento — Venda #{{ data.venda.id }}</h2>
    <div style="padding: 0 24px 24px; min-width: 360px;">
      <p style="color:#555; margin-bottom:12px">
        Total da venda: <strong>R$ {{ data.total | number:'1.2-2' }}</strong>
      </p>

      <mat-form-field style="width:100%">
        <mat-label>Forma de pagamento</mat-label>
        <mat-select [(ngModel)]="formaPagamento" name="forma">
          @for (f of formas; track f.valor) {
            <mat-option [value]="f.valor">{{ f.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (formaPagamento !== 'PENDENTE') {
        <mat-form-field style="width:100%">
          <mat-label>Valor pago (R$)</mat-label>
          <input matInput [(ngModel)]="valorPago" name="valorPago" type="number" min="0" step="0.01">
        </mat-form-field>

        @if (valorPago < data.total) {
          <p style="color:#f57c00; font-size:0.85rem; margin: 0 0 8px">
            Saldo pendente: R$ {{ (data.total - valorPago) | number:'1.2-2' }}
          </p>
        }
        @if (valorPago > data.total) {
          <p style="color:#388e3c; font-size:0.85rem; margin: 0 0 8px">
            Troco: R$ {{ (valorPago - data.total) | number:'1.2-2' }}
          </p>
        }
      }

      @if (erro) { <p style="color:red; font-size:0.85rem">{{ erro }}</p> }

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
        <button mat-button (click)="cancelar()">Cancelar</button>
        <button mat-raised-button color="primary"
          [disabled]="!formaPagamento"
          (click)="salvar()">Salvar</button>
      </div>
    </div>
  `,
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
    { valor: 'PENDENTE', label: 'Deixar Pendente' },
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
          vendas: [],
        });
      }
      const grupo = mapa.get(id)!;
      grupo.vendas.push(venda);
      grupo.totalGasto += this.totalVenda(venda);
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
      this.snackBar.open('Pagamento atualizado!', 'Fechar', { duration: 3000 });
      this.cdr.detectChanges();
    });
  }
}
