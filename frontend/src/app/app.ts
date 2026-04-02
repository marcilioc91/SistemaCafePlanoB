import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './pages/login/login';
import { ProdutoForm } from './pages/produto-form/produto-form';
import { Produtos } from './pages/produtos/produtos';
import { Vendas } from './pages/vendas/vendas';
import { CadastroModal } from './pages/cadastro-modal/cadastro-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, ProdutoForm, Produtos, Vendas, CadastroModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cafe-planob-frontend');
}
