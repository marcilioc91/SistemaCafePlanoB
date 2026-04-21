import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Cliente } from '../../models/cliente';
import { VendaResposta } from '../../models/venda';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { VendaService } from '../../services/venda.service';
import { CadastroModal } from '../cadastro-modal/cadastro-modal';
import { formatarTelefone } from '../../utils/utils';

// ── Diálogo de confirmação ────────────────────────────────────────────────────
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>{{ data.mensagem }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="dialogRef.close(false)">Não</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Sim</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensagem: string }
  ) { }
}

// ── Diálogo de edição ──────────────────────────────────────────────────────────
@Component({
  selector: 'app-cliente-edit-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cliente-edit-dialog.html',
})
export class ClienteEditDialog {
  form = { nome: '', cpf: '', telefone: '', obs: '' };
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<ClienteEditDialog>,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: { cliente: Cliente }
  ) {
    const { pessoa, obs } = data.cliente;
    this.form = {
      nome: pessoa.nome,
      cpf: pessoa.cpf ?? '',
      telefone: pessoa.telefone ?? '',
      obs: obs ?? '',
    };
  }

  salvar() {
    const atualizado: Cliente = {
      pessoa: { nome: this.form.nome, cpf: this.form.cpf, telefone: this.form.telefone || undefined },
      obs: this.form.obs || undefined,
    };
    this.clienteService.atualizar(this.data.cliente.id!, atualizado).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => { this.erro = 'Erro ao salvar. Verifique os dados.'; }
    });
  }

  fechar() { this.dialogRef.close(); }
}

// ── Diálogo de histórico de compras ───────────────────────────────────────────
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
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { clienteId: number; nomeCliente: string }
  ) { }

  ngOnInit() {
    this.vendaService.listarPorCliente(this.data.clienteId).subscribe(dados => {
      this.vendas = dados;
      this.cdr.detectChanges();
    });
  }

  total(venda: VendaResposta): number {
    return venda.itens?.reduce((acc, i) => acc + i.quantidade * +i.precoUnitario, 0) ?? 0;
  }

  fechar() { this.dialogRef.close(); }
}

// ── Página de clientes ─────────────────────────────────────────────────────────
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
  colunas = ['nome', 'telefone', 'obs', 'acoes'];

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.carregar(); }

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

  abrirEdicao(cliente: Cliente) {
    const ref = this.dialog.open(ClienteEditDialog, {
      width: '420px',
      data: { cliente }
    });
    ref.afterClosed().subscribe(sucesso => {
      if (!sucesso) return;
      this.snackBar.open('Cliente atualizado!', 'Fechar', { duration: 3000 });
      this.carregar();
    });
  }

  verCompras(cliente: Cliente) {
    this.dialog.open(HistoricoClienteDialog, {
      width: '600px',
      data: { clienteId: cliente.id, nomeCliente: cliente.pessoa.nome }
    });
  }

  excluir(cliente: Cliente) {
    if (!cliente.id) return;
    const ref = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Excluir cliente',
        mensagem: `Deseja excluir "${cliente.pessoa.nome}"? Todas as vendas, o usuário e os dados pessoais vinculados serão removidos permanentemente.`,
      },
    });
    ref.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado) return;
      const usuarioLogado = this.authService.getUsuarioLogado();
      const eOProprio = !!usuarioLogado?.pessoa?.id && usuarioLogado.pessoa.id === cliente.pessoa.id;
      this.clienteService.excluir(cliente.id!).subscribe({
        next: () => {
          this.snackBar.open('Cliente excluído.', 'Fechar', { duration: 3000 });
          if (eOProprio) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.carregar();
          }
        },
        error: () => {
          this.snackBar.open('Erro ao excluir cliente.', 'Fechar', { duration: 3000 });
        }
      });
    });
  }
  formatarTelefone = formatarTelefone;
}
