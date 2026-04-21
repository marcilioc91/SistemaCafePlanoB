import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/clientes/clientes').then(m => m.Clientes),
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/produtos/produtos').then(m => m.Produtos),
  },
  {
    path: 'produto-form',
    loadComponent: () =>
      import('./pages/produto-form/produto-form').then(m => m.ProdutoForm),
  },
  {
    path: 'vendas',
    loadComponent: () =>
      import('./pages/vendas/vendas').then(m => m.Vendas),
  },
  {
    path: 'historico-vendas',
    loadComponent: () =>
      import('./pages/historico-vendas/historico-vendas').then(m => m.HistoricoVendas),
  },
  {
    path: 'relatorio-inventario',
    loadComponent: () =>
      import('./pages/relatorio-inventario/relatorio-inventario').then(m => m.RelatorioInventario),
  },
  {
    path: 'auditoria',
    loadComponent: () =>
      import('./pages/auditoria/auditoria').then(m => m.Auditoria),
  },
];
