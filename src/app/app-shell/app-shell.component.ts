import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  gitNetworkOutline,
  checkboxOutline,
  documentTextOutline,
  settingsOutline,
} from 'ionicons/icons';

export interface ShellNavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const DEFAULT_NAV: ShellNavItem[] = [
  { path: '/home.page', label: 'Painel', icon: 'grid-outline', exact: true },
  { path: '/rota.page', label: 'Rotas', icon: 'git-network-outline' },
  { path: '/execucao.page', label: 'Executar', icon: 'checkbox-outline' },
  { path: '/ordens', label: 'Ordens', icon: 'document-text-outline' },
  
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, RouterLink],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
  /** Título sob "Ronda" ou nome da rota no modo back */
  @Input() subtitle = 'PCM · Planta Norte';
  /** Título principal da marca */
  @Input() title = 'Ronda';
  /** Mostra botão voltar */
  @Input() showBack = false;
  @Input() defaultHref = '/home';
  /** Esconde a faixa de abas */
  @Input() hideNav = false;
  @Input() navItems: ShellNavItem[] = DEFAULT_NAV;
  @Input() configPath = '/config';

  items: Array<ShellNavItem & { ativo?: boolean }> = [];

  constructor(private router: Router) {
    addIcons({
      gridOutline,
      gitNetworkOutline,
      checkboxOutline,
      documentTextOutline,
      settingsOutline,
    });
  }

  ngOnInit(): void {
    this.atualizar();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.atualizar());
  }

  private atualizar(): void {
    const url = this.router.url.split('?')[0];
    this.items = this.navItems.map((item) => ({
      ...item,
      ativo: item.exact
        ? url === item.path || url === '/'
        : url === item.path || url.startsWith(item.path + '/'),
    }));
  }

  abrirConfig(): void {
    void this.router.navigateByUrl(this.configPath);
  }
}
