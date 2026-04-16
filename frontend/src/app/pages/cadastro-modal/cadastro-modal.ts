import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
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

function cpfValido(cpf: string): boolean {
  const n = cpf.replace(/\D/g, '');
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += +n[i] * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== +n[9]) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += +n[i] * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === +n[10];
}

function emailValido(email: string): boolean {
  return /^[\w+.%-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
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
    private cdr: ChangeDetectorRef,
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

  private validarCamposComuns(): boolean {
    if (!cpfValido(this.conta.cpf)) {
      this.erro = 'CPF inválido.';
      this.cdr.markForCheck();
      return false;
    }
    return true;
  }

  private salvarUsuario() {
    if (!this.validarCamposComuns()) return;
    if (!emailValido(this.conta.email)) {
      this.erro = 'E-mail inválido.';
      this.cdr.markForCheck();
      return;
    }
    this.erro = '';
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
        this.cdr.markForCheck();
      }
    });
  }

  private salvarCliente() {
    if (!this.validarCamposComuns()) return;
    this.erro = '';
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
      error: (err) => {
        this.erro = err.error ?? 'Erro ao cadastrar cliente.';
        this.cdr.markForCheck();
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
    if (!this.validarCamposComuns()) return;
    if (!emailValido(this.conta.email)) {
      this.erro = 'E-mail inválido.';
      this.cdr.markForCheck();
      return;
    }
    this.erro = '';
    this.step = 1;
    this.cdr.markForCheck();
  }

  prevStep() {
    this.step = 0;
  }
}
