import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoForm } from './pages/produto-form/produto-form';
import { Vendas } from './pages/vendas/vendas';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'produtos', component: Produtos },
  { path: 'produto-form', component: ProdutoForm },
  { path: 'vendas', component: Vendas }
];
