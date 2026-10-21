import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: 'new-rota.page',
    loadComponent: () => import('./new-rota.page/new-rota.page.page').then( m => m.NewRotaPagePage)
  },
  {
    path: 'maquina.page',
    loadComponent: () => import('./maquina.page/maquina.page.page').then( m => m.MaquinaPagePage)
  },
  {
    path: 'almoxerifado.page',
    loadComponent: () => import('./almoxerifado.page/almoxerifado.page.page').then( m => m.AlmoxerifadoPagePage)
  },
];
