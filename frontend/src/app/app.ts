import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { ProdutoForm } from './pages/produto-form/produto-form';
import { Produtos } from './pages/produtos/produtos';
import { Vendas } from './pages/vendas/vendas';
import { Clientes } from './pages/clientes/clientes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Home, ProdutoForm, Produtos, Vendas, Clientes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cafe-planob-frontend');
}
