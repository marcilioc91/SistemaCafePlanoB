import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { VendaResposta } from '../../models/venda';
import { VendaService } from '../../services/venda.service';

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
  vendas: VendaResposta[] = [];
  colunasItens = ['produto', 'quantidade', 'precoUnitario', 'subtotal'];

  constructor(private vendaService: VendaService) {}

  ngOnInit() {
    this.vendaService.listarTodas().subscribe(dados => {
      this.vendas = dados;
    });
  }

  totalVenda(venda: VendaResposta): number {
    return venda.itens?.reduce((acc, i) => acc + i.quantidade * +i.precoUnitario, 0) ?? 0;
  }
}
