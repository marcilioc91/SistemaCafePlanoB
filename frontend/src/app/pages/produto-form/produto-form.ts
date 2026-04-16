import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

// ── Diálogo de novo/editar produto ────────────────────────────────────────────
@Component({
  selector: 'app-produto-form-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 style="padding: 24px 24px 0">{{ modoEdicao ? 'Editar Produto' : 'Novo Produto' }}</h2>
    <div style="padding: 0 24px 24px; display: flex; flex-direction: column; gap: 4px; min-width: 320px;">
      <mat-form-field>
        <mat-label>Nome</mat-label>
        <input matInput [(ngModel)]="dados.nome" name="nome">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Preço de custo (R$)</mat-label>
        <input matInput [(ngModel)]="dados.preco_custo" name="preco_custo" type="number" min="0" step="0.01">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Preço (R$)</mat-label>
        <input matInput [(ngModel)]="dados.preco" name="preco" type="number" min="0.01" step="0.01">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Estoque</mat-label>
        <input matInput [(ngModel)]="dados.estoque" name="estoque" type="number" min="0">
      </mat-form-field>
      @if (erro) { <p style="color: red; font-size: 0.85rem">{{ erro }}</p> }
      <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
        <button mat-button (click)="fechar()">Cancelar</button>
        <button mat-raised-button color="primary"
          [disabled]="!dados.nome || dados.preco == null || dados.estoque == null"
          (click)="confirmar()">Salvar</button>
      </div>
    </div>
  `,
})
export class ProdutoFormDialog {
  dados: Produto;
  modoEdicao: boolean;
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<ProdutoFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { produto?: Produto } | null
  ) {
    this.modoEdicao = !!data?.produto;
    this.dados = data?.produto
      ? { ...data.produto }
      : { nome: '', preco: 0, preco_custo: 0, estoque: 0 };
  }

  confirmar() {
    if (this.dados.preco <= 0) {
      this.erro = 'O preço deve ser maior que zero.';
      return;
    }
    this.dialogRef.close(this.dados);
  }

  fechar() { this.dialogRef.close(); }
}

// ── Página de produtos ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm implements OnInit {
  produtos: Produto[] = [];
  colunas = ['semEstoque', 'nome', 'preco', 'estoque', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.produtoService.listar().subscribe(dados => {
      this.produtos = dados;
      this.cdr.detectChanges();
    });
  }

  abrirFormulario() {
    const ref = this.dialog.open(ProdutoFormDialog, { width: '400px', data: null });
    ref.afterClosed().subscribe((dados: Produto | undefined) => {
      if (!dados) return;
      this.produtoService.salvar(dados).subscribe({
        next: () => {
          this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao cadastrar produto.', 'Fechar', { duration: 3000 })
      });
    });
  }

  abrirEdicao(produto: Produto) {
    const ref = this.dialog.open(ProdutoFormDialog, { width: '400px', data: { produto } });
    ref.afterClosed().subscribe((dados: Produto | undefined) => {
      if (!dados || !dados.id) return;
      this.produtoService.atualizar(dados.id, dados).subscribe({
        next: () => {
          this.snackBar.open('Produto atualizado!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: () => this.snackBar.open('Erro ao atualizar produto.', 'Fechar', { duration: 3000 })
      });
    });
  }

  marcarSemEstoque(produto: Produto, checked: boolean) {
    if (!produto.id || !checked) return;
    const atualizado = { ...produto, estoque: 0 };
    this.produtoService.atualizar(produto.id, atualizado).subscribe({
      next: () => {
        this.snackBar.open('Produto marcado como sem estoque.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => this.snackBar.open('Erro ao atualizar estoque.', 'Fechar', { duration: 3000 })
    });
  }

  excluir(produto: Produto) {
    if (!produto.id) return;
    this.produtoService.excluir(produto.id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => this.snackBar.open('Erro ao excluir produto.', 'Fechar', { duration: 3000 })
    });
  }
}
