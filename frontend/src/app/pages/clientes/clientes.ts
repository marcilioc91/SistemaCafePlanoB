import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { VendaResposta } from '../../models/venda';
import { ClienteService } from '../../services/cliente.service';
import { VendaService } from '../../services/venda.service';
import { CadastroModal } from '../cadastro-modal/cadastro-modal';

@Component({
  selector: 'app-historico-cliente-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatTableModule, MatButtonModule, MatExpansionModule],
  template: `
    <h2 style="padding: 24px 24px 0">Compras de {{ data.nomeCliente }}</h2>
    <div style="padding: 0 24px 24px; min-width: 480px; max-height: 70vh; overflow-y: auto;">
      @if (vendas.length === 0) {
        <p style="color: #888; text-align:center; margin-top: 24px;">Nenhuma compra registrada.</p>
      } @else {
        <mat-accordion>
          @for (venda of vendas; track venda.id) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Venda #{{ venda.id }}</mat-panel-title>
                <mat-panel-description>
                  {{ venda.data_venda | date:'dd/MM/yyyy HH:mm' }} — R$ {{ total(venda) | number:'1.2-2' }}
                </mat-panel-description>
              </mat-expansion-panel-header>
              <table mat-table [dataSource]="venda.itens" style="width:100%">
                <ng-container matColumnDef="produto">
                  <th mat-header-cell *matHeaderCellDef>Produto</th>
                  <td mat-cell *matCellDef="let i">{{ i.produto.nome }}</td>
                </ng-container>
                <ng-container matColumnDef="quantidade">
                  <th mat-header-cell *matHeaderCellDef>Qtd.</th>
                  <td mat-cell *matCellDef="let i">{{ i.quantidade }}</td>
                </ng-container>
                <ng-container matColumnDef="subtotal">
                  <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                  <td mat-cell *matCellDef="let i">R$ {{ i.quantidade * i.precoUnitario | number:'1.2-2' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="colunas"></tr>
                <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
              </table>
            </mat-expansion-panel>
          }
        </mat-accordion>
      }
      <div style="margin-top:16px; text-align:right">
        <button mat-button (click)="fechar()">Fechar</button>
      </div>
    </div>
  `,
})
export class HistoricoClienteDialog implements OnInit {
  vendas: VendaResposta[] = [];
  colunas = ['produto', 'quantidade', 'subtotal'];

  constructor(
    private dialogRef: MatDialogRef<HistoricoClienteDialog>,
    private vendaService: VendaService,
    @Inject(MAT_DIALOG_DATA) public data: { clienteId: number; nomeCliente: string }
  ) { }

  ngOnInit() {
    this.vendaService.listarPorCliente(this.data.clienteId).subscribe(dados => {
      this.vendas = dados;
    });
  }

  total(venda: VendaResposta): number {
    return venda.itens?.reduce((acc, i) => acc + i.quantidade * +i.precoUnitario, 0) ?? 0;
  }

  fechar() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  colunas = ['nome', 'cpf', 'telefone', 'obs', 'acoes'];

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.clienteService.listar().subscribe(dados => {
      this.clientes = dados;
      this.cdr.detectChanges();
    });
  }

  abrirFormulario() {
    const ref = this.dialog.open(CadastroModal, {
      width: '400px',
      data: { modo: 'cliente' }
    });
    ref.afterClosed().subscribe(sucesso => {
      if (!sucesso) return;
      this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      this.carregar();
    });
  }

  verCompras(cliente: Cliente) {
    const ref = this.dialog.open(HistoricoClienteDialog, {
      width: '560px',
      data: { clienteId: cliente.id, nomeCliente: cliente.pessoa.nome }
    });

    ref.afterClosed().subscribe(() => {
      this.carregar();
    });
  }

  excluir(cliente: Cliente) {
    if (!cliente.id) return;
    this.clienteService.excluir(cliente.id).subscribe({
      next: () => {
        this.snackBar.open('Cliente excluído.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir cliente.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
