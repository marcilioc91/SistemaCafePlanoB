import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-form-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 style="padding: 24px 24px 0">Novo Produto</h2>
    <div style="padding: 0 24px 24px; display: flex; flex-direction: column; gap: 12px; min-width: 320px;">
      <mat-form-field>
        <mat-label>Nome</mat-label>
        <input matInput [(ngModel)]="dados.nome" name="nome">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Preço (R$)</mat-label>
        <input matInput [(ngModel)]="dados.preco" name="preco" type="number" min="0" step="0.01">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Estoque inicial</mat-label>
        <input matInput [(ngModel)]="dados.estoque" name="estoque" type="number" min="0">
      </mat-form-field>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button mat-button (click)="fechar()">Cancelar</button>
        <button mat-raised-button color="primary"
          [disabled]="!dados.nome || dados.preco == null || dados.estoque == null"
          (click)="confirmar()">Salvar</button>
      </div>
    </div>
  `,
})
export class ProdutoFormDialog {
  dados: Produto = { nome: '', preco: 0, estoque: 0 };

  constructor(private dialogRef: MatDialogRef<ProdutoFormDialog>) {}

  confirmar() {
    this.dialogRef.close(this.dados);
  }

  fechar() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm implements OnInit {
  produtos: Produto[] = [];
  colunas = ['nome', 'preco', 'estoque', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.produtoService.listar().subscribe(dados => {
      this.produtos = dados;
    });
  }

  excluir(produto: Produto) {
    if (!produto.id) return;
    this.produtoService.excluir(produto.id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir produto.', 'Fechar', { duration: 3000 });
      }
    });
  }

  abrirFormulario() {
    const ref = this.dialog.open(ProdutoFormDialog, { width: '400px' });
    ref.afterClosed().subscribe((dados: Produto | undefined) => {
      if (!dados) return;
      this.produtoService.salvar(dados).subscribe({
        next: () => {
          this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.carregar();
        },
        error: () => {
          this.snackBar.open('Erro ao cadastrar produto.', 'Fechar', { duration: 3000 });
        }
      });
    });
  }
}
