import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';

export interface CadastroModalData {
  modo: 'usuario' | 'cliente';
}

@Component({
  selector: 'app-cadastro-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective,
    MatIcon,
    CommonModule
  ],
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-modal.html',
  styleUrl: './cadastro-modal.css',
})
export class CadastroModal {
  conta = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    usuario: '',
    senha: '',
    obs: ''
  }

  erro = '';

  constructor(
    private dialogRef: MatDialogRef<CadastroModal>,
    private auth: AuthService,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: CadastroModalData
  ) {}

  get modoCliente() {
    return this.data?.modo === 'cliente';
  }

  salvar() {
    if (this.modoCliente) {
      this.salvarCliente();
    } else {
      this.salvarUsuario();
    }
  }

  private salvarUsuario() {
    this.auth.cadastrar({
      nome: this.conta.nome,
      cpf: this.conta.cpf,
      email: this.conta.email,
      usuario: this.conta.usuario,
      senha: this.conta.senha,
      obs: this.conta.obs || undefined
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.erro = err.error ?? 'Erro ao realizar cadastro.';
      }
    });
  }

  private salvarCliente() {
    const cliente: Cliente = {
      pessoa: {
        nome: this.conta.nome,
        cpf: this.conta.cpf,
        telefone: this.conta.telefone || undefined,
      },
      obs: this.conta.obs || undefined,
    };
    this.clienteService.salvar(cliente).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.erro = 'Erro ao cadastrar cliente.';
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }

  hide = true;

  togglePassword() {
    this.hide = !this.hide;
  }

  step = 0;

  nextStep() {
    this.step = 1;
  }

  prevStep() {
    this.step = 0;
  }
}
