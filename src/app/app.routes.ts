import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home.page',
    pathMatch: 'full',
  },
  {
    path: 'home.page',
    loadComponent: () => import('./home.page/home.page.page').then( m => m.HomePagePage)
  },
  {
    path: 'rota.page',
    loadComponent: () => import('./rota.page/rota.page.page').then( m => m.RotaPagePage)
  },
  {
    path: 'execucao.page',
    loadComponent: () => import('./execucao.page/execucao.page.page').then( m => m.ExecucaoPagePage)
  },
];
