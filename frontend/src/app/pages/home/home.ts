import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  irParaCadastroCliente() {
    this.router.navigate(['/clientes']);
  }

  irParaCadastroProduto() {
    this.router.navigate(['/produto-form']);
  }

  irParaHistoricoVendas() {
    this.router.navigate(['/historico-vendas']);
  }

  logout() {
    this.router.navigate(['/']);
  }
}
