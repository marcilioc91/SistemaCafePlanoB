import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

// ── Diálogo de reset de senha ─────────────────────────────────────────────────
@Component({
  selector: 'app-reset-senha-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Redefinir senha</h2>
    <mat-dialog-content>
      <p class="reset-subtitulo">Usuário: <strong>{{ data.nomeUsuario }}</strong></p>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Nova senha</mat-label>
        <input matInput [(ngModel)]="novaSenha" [type]="ocultarSenha ? 'password' : 'text'" autocomplete="new-password">
        <button matSuffix mat-icon-button (click)="ocultarSenha = !ocultarSenha" type="button">
          <mat-icon>{{ ocultarSenha ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </mat-form-field>
      <p class="reset-erro" *ngIf="erro">{{ erro }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()">Redefinir</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .reset-subtitulo { color: #555; margin-bottom: 16px; }
    .reset-erro { color: #c62828; font-size: 0.85rem; margin-top: 4px; }
  `],
})
export class ResetSenhaDialog {
  novaSenha = '';
  ocultarSenha = true;
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<ResetSenhaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { nomeUsuario: string }
  ) {}

  confirmar() {
    if (!this.novaSenha.trim()) {
      this.erro = 'Informe a nova senha.';
      return;
    }
    this.dialogRef.close(this.novaSenha);
  }

  fechar() { this.dialogRef.close(); }
}

// ── Página de gerenciar usuários ──────────────────────────────────────────────
@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './gerenciar-usuarios.html',
  styleUrl: './gerenciar-usuarios.css',
})
export class GerenciarUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  carregando = true;
  adminId: number | null = null;
  colunas = ['nome', 'login', 'email', 'perfil', 'acao'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.adminId = this.auth.getUsuarioLogado()?.id ?? null;
    this.auth.listarUsuarios().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.carregando = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  alternarPerfil(usuario: Usuario) {
    const novoPerfil = usuario.perfil === 'ADMIN' ? 'OPERADOR' : 'ADMIN';
    this.auth.atualizarPerfil(usuario.id!, novoPerfil).subscribe({
      next: (atualizado) => {
        usuario.perfil = atualizado.perfil;
        this.cdRef.detectChanges();
      },
    });
  }

  abrirResetSenha(usuario: Usuario) {
    const ref = this.dialog.open(ResetSenhaDialog, {
      width: '380px',
      data: { nomeUsuario: usuario.pessoa?.nome ?? usuario.usuarioLogin },
    });
    ref.afterClosed().subscribe((novaSenha: string | undefined) => {
      if (!novaSenha) return;
      this.auth.resetSenha(usuario.id!, novaSenha).subscribe({
        next: () => this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', { duration: 3000 }),
        error: () => this.snackBar.open('Erro ao redefinir senha.', 'Fechar', { duration: 3000 }),
      });
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
