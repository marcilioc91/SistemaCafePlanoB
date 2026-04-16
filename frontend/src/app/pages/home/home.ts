import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  nomeUsuario: string = '';

  constructor(private router: Router, private auth: AuthService) {
    const usuario = this.auth.getUsuarioLogado();
    this.nomeUsuario = usuario?.pessoa?.nome ?? usuario?.usuarioLogin ?? '';
  }

  irParaCadastroCliente() {
    this.router.navigate(['/clientes']);
  }

  irParaCadastroProduto() {
    this.router.navigate(['/produto-form']);
  }

  irParaNovaVenda() {
    this.router.navigate(['/vendas']);
  }

  irParaHistoricoVendas() {
    this.router.navigate(['/historico-vendas']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
