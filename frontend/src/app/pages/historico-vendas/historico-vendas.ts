import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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

// ── Diálogo de pagamento geral do cliente ────────────────────────────────────
@Component({
  selector: 'app-pagamento-total-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './pagamento-total-dialog.html',
})
export class PagamentoTotalDialog {
  formaPagamento = '';
  valorPago: number;
  erro = '';

  formas = [
    { valor: 'DINHEIRO', label: 'Dinheiro' },
    { valor: 'PIX', label: 'PIX' },
    { valor: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { valor: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { valor: 'VOUCHER', label: 'Voucher' },
    { valor: 'PENDENTE', label: 'Deixar Pendente' },
  ];

  constructor(
    private dialogRef: MatDialogRef<PagamentoTotalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { nomeCliente: string; totalPendente: number }
  ) {
    this.valorPago = data.totalPendente;
  }

  confirmar() {
    const valorFinal = this.formaPagamento === 'PENDENTE' ? 0 : this.valorPago;
    this.dialogRef.close({ formaPagamento: this.formaPagamento, valorPago: valorFinal });
  }

  cancelar() { this.dialogRef.close(null); }
}

// ── Página de histórico ───────────────────────────────────────────────────────
@Component({
  selector: 'app-historico-vendas',
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    RouterLink,
    MatFormField,
    MatSelect,
    MatLabel,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './historico-vendas.html',
  styleUrl: './historico-vendas.css',
})
export class HistoricoVendas implements OnInit {
  grupos: GrupoCliente[] = [];
  carregando = true;
  colunasItens = ['produto', 'quantidade', 'precoUnitario', 'subtotal'];

  filtroMes = 0;
  filtroAno = 0;
  filtroStatus = '';
  filtroCliente = '';

  readonly meses = [
    { valor: 0, label: 'Todos os meses' },
    { valor: 1, label: 'Janeiro' }, { valor: 2, label: 'Fevereiro' },
    { valor: 3, label: 'Março' }, { valor: 4, label: 'Abril' },
    { valor: 5, label: 'Maio' }, { valor: 6, label: 'Junho' },
    { valor: 7, label: 'Julho' }, { valor: 8, label: 'Agosto' },
    { valor: 9, label: 'Setembro' }, { valor: 10, label: 'Outubro' },
    { valor: 11, label: 'Novembro' }, { valor: 12, label: 'Dezembro' },
  ];

  get anos(): { valor: number; label: string }[] {
    const set = new Set<number>();
    for (const g of this.grupos) {
      for (const v of g.vendas) {
        set.add(new Date(v.data_venda).getFullYear());
      }
    }
    const anoAtual = new Date().getFullYear();
    if (!set.has(anoAtual)) set.add(anoAtual);
    return [
      { valor: 0, label: 'Todos os anos' },
      ...Array.from(set).sort().map(a => ({ valor: a, label: String(a) })),
    ];
  }

  get clientesSugeridos(): string[] {
    const termo = this.filtroCliente.toLowerCase().trim();
    return this.grupos
      .map(g => g.nomeCliente)
      .filter(nome => !termo || nome.toLowerCase().includes(termo));
  }

  get gruposFiltrados(): GrupoCliente[] {
    return this.grupos
      .filter(grupo => {
        if (!this.filtroCliente.trim()) return true;
        return grupo.nomeCliente.toLowerCase().includes(this.filtroCliente.toLowerCase().trim());
      })
      .map(grupo => {
        let vendas = grupo.vendas;

        if (this.filtroMes || this.filtroAno) {
          vendas = vendas.filter(v => {
            const d = new Date(v.data_venda);
            return (!this.filtroMes || d.getMonth() + 1 === this.filtroMes) &&
              (!this.filtroAno || d.getFullYear() === this.filtroAno);
          });
        }

        if (!vendas.length) return null;

        let totalGasto = 0, totalPago = 0;

        for (const v of vendas) {
          const tot = this.totalVenda(v);
          const pago = v.valorPago ?? 0;

          totalGasto += tot;
          totalPago += pago;
        }
        const totalPendente = Math.max(0, totalGasto - totalPago);
        const totalCredito = Math.max(0, totalPago - totalGasto);

        if (this.filtroStatus === 'PENDENTE' && !(totalPago < totalGasto)) return null;
        if (this.filtroStatus === 'PAGO' && !(totalPago === totalGasto)) return null;
        if (this.filtroStatus === 'CREDITO' && totalCredito <= 0) return null;

        return {
          ...grupo,
          vendas: vendas,
          totalGasto,
          totalPago,
          totalPendente,
          totalCredito
        };
      })
      .filter((g): g is GrupoCliente => g !== null);
  }

  limparFiltros() {
    this.filtroMes = 0;
    this.filtroAno = 0;
    this.filtroStatus = '';
    this.filtroCliente = '';
  }

  constructor(
    private vendaService: VendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

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
      VOUCHER: 'Voucher',
      PENDENTE: 'Pendente'
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

  abrirPagamentoTotal(grupo: GrupoCliente) {
    const ref = this.dialog.open(PagamentoTotalDialog, {
      width: '420px',
      data: { nomeCliente: grupo.nomeCliente, totalPendente: grupo.totalPendente }
    });
    ref.afterClosed().subscribe((resultado: { formaPagamento: string; valorPago: number } | null) => {
      if (!resultado) return;

      const { formaPagamento, valorPago } = resultado;
      const pendentes = [...grupo.vendas]
        .filter(v => (v.valorPago ?? 0) < this.totalVenda(v))
        .sort((a, b) => a.id - b.id);

      if (!pendentes.length) return;

      // Distribui o valor pago nas vendas pendentes (mais antigas primeiro)
      let restante = valorPago;
      const atualizacoes: { id: number; valorPago: number }[] = [];

      for (const v of pendentes) {
        if (restante <= 0) break;
        const jaAdiantado = v.valorPago ?? 0;
        const faltava = this.totalVenda(v) - jaAdiantado;
        const aplicar = Math.min(restante, faltava);
        atualizacoes.push({ id: v.id, valorPago: jaAdiantado + aplicar });
        restante -= aplicar;
      }

      // Se sobrou valor (pagamento a mais), aplica como crédito na última venda atualizada
      if (restante > 0 && atualizacoes.length > 0) {
        atualizacoes[atualizacoes.length - 1].valorPago += restante;
      }

      forkJoin(
        atualizacoes.map(a => this.vendaService.atualizarPagamento(a.id, { formaPagamento, valorPago: a.valorPago }))
      ).subscribe({
        next: () => {
          this.snackBar.open('Pagamento registrado!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao registrar pagamento.', 'Fechar', { duration: 3000 })
      });
    });
  }
}
