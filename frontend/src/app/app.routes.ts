import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoForm } from './pages/produto-form/produto-form';
import { Vendas } from './pages/vendas/vendas';
import { Clientes } from './pages/clientes/clientes';
import { HistoricoVendas } from './pages/historico-vendas/historico-vendas';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'home', component: Home },
  { path: 'clientes', component: Clientes },
  { path: 'produtos', component: Produtos },
  { path: 'produto-form', component: ProdutoForm },
  { path: 'vendas', component: Vendas },
  { path: 'historico-vendas', component: HistoricoVendas }
];
