
import { Component} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
 IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  ViewWillEnter,
   } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  gitNetworkOutline,
  checkboxOutline,
  documentTextOutline,
  settingsOutline,
} from 'ionicons/icons';

/** Formato que a tela espera — implemente no seu serviço de dados. */
export interface DashboardStat {
  label: string;
  value: number;
  link: string;
}

export interface DashboardRota {
  id: string;
  nome: string;
  equipeNome?: string;
  status: string;
  doneCount: number;
  stopCount: number;
}

export interface DashboardAlerta {
  id: string;
  tag: string;
  machineName: string;
  techniqueLabel: string;
  reading: string;
  judgment: string;
  recordedLabel?: string;
  sourceLabel?: string;
  link?: string;
}
export interface DashboardData {
  todayLabel: string;
  machineCount: number;
  openRoutes: number;
  openOrders: number;
  lowStock: number;
  routes: DashboardRota[];
  alerts: DashboardAlerta[];
}
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  ativo?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  planejada: 'Planejada',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
};

const JULGAMENTO_LABEL: Record<string, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

@Component({
  selector: 'app-home.page',
  templateUrl: './home.page.page.html',
  styleUrls: ['./home.page.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonSpinner,
    IonIcon,
    RouterLink,
  ],
})
export class HomePagePage implements ViewWillEnter {
  carregando = true;
  erro = '';
  kicker = 'Planta Norte';

  stats: DashboardStat[] = [];
  rotas: DashboardRota[] = [];
  alertas: DashboardAlerta[] = [];

  /** Abas do cabeçalho — ajuste os paths se o IRA usar outros */
    nav: NavItem[] = [
    { path: '/home.page', label: 'Painel', icon: 'grid-outline', exact: true },
    { path: '/rota.page', label: 'Rotas', icon: 'git-network-outline' },
    { path: '/execucao.page', label: 'Executar', icon: 'checkbox-outline' },
    { path: '/ordens', label: 'Ordens', icon: 'document-text-outline' },
  ];


  constructor(private router: Router) {

        addIcons({
      gridOutline,
      gitNetworkOutline,
      checkboxOutline,
      documentTextOutline,
      settingsOutline,
    });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.atualizarAbaAtiva());

    this.atualizarAbaAtiva();
  }

  ionViewWillEnter(): void {
    this.atualizarAbaAtiva();
    void this.carregar();
  }

  private atualizarAbaAtiva(): void {
    const url = this.router.url.split('?')[0];
    this.nav = this.nav.map((item) => ({
      ...item,
      ativo: item.exact
        ? url === item.path || url === '/' || url === '/home'
        : url === item.path || url.startsWith(item.path + '/'),
    }));
  }

  async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = '';

    try {
      const data = await this.obterDashboard();

      this.kicker = `Planta Norte · ${data.todayLabel || this.hojeLabel()}`;

      this.stats = [
        { label: 'Máquinas', value: data.machineCount ?? 0, link: '/maquinas' },
        { label: 'Rotas abertas', value: data.openRoutes ?? 0, link: '/lista-rotas' },
        { label: 'OS abertas', value: data.openOrders ?? 0, link: '/ordens' },
        { label: 'Abaixo do mínimo', value: data.lowStock ?? 0, link: '/almoxarifado' },
      ];

      this.rotas = data.routes ?? [];
      this.alertas = data.alerts ?? [];
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível carregar o painel.';
      this.stats = [];
      this.rotas = [];
      this.alertas = [];
    } finally {
      this.carregando = false;
    }
  }

  /**
   * PONTO ÚNICO DE DADOS
   * Substitua pelo seu serviço (Firebase, API, SQLite…).
   */
  private async obterDashboard(): Promise<DashboardData> {
    return {
      todayLabel: this.hojeLabel(),
      machineCount: 12,
      openRoutes: 2,
      openOrders: 1,
      lowStock: 2,
      routes: [],
      alerts: [],
    };
  }

  progresso(rota: DashboardRota): number {
    if (!rota.stopCount) return 0;
    return Math.round((rota.doneCount / rota.stopCount) * 100);
  }

  rotuloStatus(status: string): string {
    return STATUS_LABEL[status] || status || '—';
  }

  rotuloJulgamento(valor: string): string {
    return JULGAMENTO_LABEL[valor] || valor || '—';
  }

  abrir(link: string): void {
    if (link) void this.router.navigateByUrl(link);
  }

  abrirExecucao(id: string): void {
    void this.router.navigate(['/execucao', id]);
  }

  abrirConfig(): void {
    void this.router.navigateByUrl('/config');
  }

  private hojeLabel(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  }




