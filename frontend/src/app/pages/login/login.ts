import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CadastroModal } from '../cadastro-modal/cadastro-modal';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    RouterLink,
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

  constructor(private auth: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  login() {
    if (!this.conta.login || !this.conta.senha) {
      console.error("Preencha todos os campos para realizar o login.");
      return;
    }
    this.auth.login(this.conta).subscribe(res => {
      console.log("Login realizado com sucesso!", res)
    })
  }

  abrirCadastro() {
    const dialogRef = this.dialog.open(CadastroModal, {
      width: '400px'
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
