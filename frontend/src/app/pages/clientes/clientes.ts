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
  templateUrl: './historico-cliente-dialog.html',
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
    this.clienteService.listar().subscribe({
      next: dados => {
        this.clientes = dados;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar clientes.', 'Fechar', { duration: 4000 });
      }
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
