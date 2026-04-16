import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    RouterLink,
  ],
  templateUrl: './historico-vendas.html',
  styleUrl: './historico-vendas.css',
})
export class HistoricoVendas implements OnInit {
  grupos: GrupoCliente[] = [];
  colunasItens = ['produto', 'quantidade', 'precoUnitario', 'subtotal'];

  constructor(private vendaService: VendaService) {}

  ngOnInit() {
    this.vendaService.listarTodas().subscribe({
      next: vendas => { this.grupos = this.agruparPorCliente(vendas); },
      error: () => { this.grupos = []; }
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
}
