import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-modal.html',
  styleUrl: './cadastro-modal.css',
})
export class CadastroModal {
    usuario = {
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
    this.dialogRef.close(this.usuario);
  }

  fechar() {
    this.dialogRef.close();
  }
}
