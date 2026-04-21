import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CadastroModal } from '../cadastro-modal/cadastro-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  conta = {
    login: '',
    senha: ''
  }

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  login() {
    if (!this.conta.login || !this.conta.senha) {
      return;
    }
    this.auth.login(this.conta).subscribe({
      next: (usuario: any) => {
        this.auth.setUsuarioLogado(usuario);
        this.router.navigate(['/home']);
        this.snackBar.open(`Login realizado com sucesso! Bem-vindo, ${usuario.pessoa?.nome || usuario.usuarioLogin}!`, 'Fechar', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.snackBar.open('Erro de conexão. Tente novamente.', 'Fechar', { duration: 3000 });
        } else if (err.status === 401) {
          this.snackBar.open('Login ou senha inválidos.', 'Fechar', { duration: 3000 });
        } else {
          this.snackBar.open('Erro inesperado. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  abrirCadastro() {
    const dialogRef = this.dialog.open(CadastroModal, {
      width: '400px',
      data: { modo: 'usuario' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  hide = true;

  togglePassword() {
    this.hide = !this.hide;
  }
}
