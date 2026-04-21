import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { VendaService } from '../../services/venda.service';
import { RelatorioInventarioItem } from '../../models/venda';

@Component({
  selector: 'app-relatorio-inventario',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './relatorio-inventario.html',
  styleUrl: './relatorio-inventario.css',
})
export class RelatorioInventario implements OnInit {
  itens: RelatorioInventarioItem[] = [];
  carregando = true;
  colunas = ['nomeProduto', 'quantidadeVendida', 'totalReceita', 'totalCusto', 'lucro'];

  get totalReceita(): number {
    return this.itens.reduce((s, i) => s + i.totalReceita, 0);
  }

  get totalCusto(): number {
    return this.itens.reduce((s, i) => s + i.totalCusto, 0);
  }

  get totalLucro(): number {
    return this.itens.reduce((s, i) => s + i.lucro, 0);
  }

  constructor(private vendaService: VendaService, private router: Router) {}

  ngOnInit() {
    this.vendaService.getRelatorioInventario().subscribe({
      next: (dados) => {
        this.itens = dados;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
