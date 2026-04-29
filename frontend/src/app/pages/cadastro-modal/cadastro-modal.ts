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
import { cpfValido, emailValido } from '../../utils/utils';

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

  validarCpf() {
    if (this.conta.cpf && !cpfValido(this.conta.cpf)) {
      this.erro = 'CPF inválido.';
      this.cdr.markForCheck();
    } else {
      this.erro = '';
    }
  }

  get isCpfValido(): boolean {
    return !this.conta.cpf || cpfValido(this.conta.cpf);
  }

  get isEmailValido(): boolean {
    return emailValido(this.conta.email);
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
    if (this.conta.cpf && !cpfValido(this.conta.cpf)) {
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
      telefone: this.conta.telefone || undefined,
      usuario: this.conta.usuario,
      senha: this.conta.senha,
      obs: this.conta.obs || undefined
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.erro = typeof err.error === 'string' ? err.error : 'Erro ao realizar cadastro.';
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
        cpf: this.conta.cpf || undefined,
        telefone: this.conta.telefone || undefined,
      },
      obs: this.conta.obs || undefined,
    };
    this.clienteService.salvar(cliente).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.erro = typeof err.error === 'string' ? err.error : 'Erro ao cadastrar cliente.';
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
