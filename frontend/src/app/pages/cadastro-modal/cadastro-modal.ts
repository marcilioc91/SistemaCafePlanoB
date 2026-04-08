import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

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
      usuario: '',
      senha: '',
      quarto: '',
      obs: ''
  }
  constructor(private dialogRef: MatDialogRef<CadastroModal>) {}

  salvar() {
    // Aqui você pode adicionar a lógica para salvar os dados do usuário
    this.dialogRef.close(this.conta);
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
