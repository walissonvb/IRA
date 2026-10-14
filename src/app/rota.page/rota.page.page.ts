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
  IonSearchbar
   } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  gitNetworkOutline,
  checkboxOutline,
  documentTextOutline,
  settingsOutline,
} from 'ionicons/icons';

export interface RotaItem {
  id: string;
  codigo?: string;
  nome: string;
  equipeNome?: string;
  criadoLabel?: string;
  status: string;
  doneCount: number;
  stopCount: number;
  tecnicasLabel?: string;
  osId?: string;
  /** UI local */
  confirmandoExclusao?: boolean;
  excluindo?: boolean;
  erroExclusao?: string;
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

@Component({
  selector: 'app-rota.page',
  templateUrl: './rota.page.page.html',
  styleUrls: ['./rota.page.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonSpinner,
    IonIcon,
    RouterLink,
    IonSearchbar,

  ],
})
export class RotaPagePage implements ViewWillEnter {
  carregando = true;
  erro = '';
  busca = '';

  rotas: RotaItem[] = [];
  rotasFiltradas: RotaItem[] = [];
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
        ? url === item.path || url === '/'
        : url === item.path || url.startsWith(item.path + '/'),
    }));
  }

  async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = '';
    try {
      this.rotas = await this.listarRotas();
      this.filtrar();
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível listar as rotas.';
      this.rotas = [];
      this.rotasFiltradas = [];
    } finally {
      this.carregando = false;
    }
  }
onBuscas(ev: any): void{
  this.busca = ev?.detail?.value ?? ev?.target?.value ?? '';
  this.filtrar();
}


  filtrar(): void {
    const q = this.busca.trim().toLowerCase();
    if (!q) {
      this.rotasFiltradas = [...this.rotas];
      return;
    }
    this.rotasFiltradas = this.rotas.filter((r) => 
        (r.nome || '').toLowerCase().includes(q) ||
        (r.codigo || '').toLowerCase().includes(q) ||
        (r.equipeNome || '').toLowerCase().includes(q)
      );
    
  }

  /**
   * PONTO ÚNICO DE DADOS — liste as rotas do seu banco.
   * Substitua o stub pela sua implementação.
   */
  private async listarRotas(): Promise<RotaItem[]> {
    // Stub vazio para a tela abrir; troque pela sua API/Firebase
    return [];
  }

  /**
   * Exclusão no banco — implemente aqui.
   */
  private async excluirNoBanco(id: string): Promise<void> {
    // await seuServico.excluirRota(id);
    throw new Error('Exclusão ainda não conectada ao banco.');
  }

  async excluir(rota: RotaItem): Promise<void> {
    rota.excluindo = true;
    rota.erroExclusao = '';
    try {
      await this.excluirNoBanco(rota.id);
      this.rotas = this.rotas.filter((r) => r.id !== rota.id);
      this.filtrar();
    } catch (e) {
      rota.erroExclusao = e instanceof Error ? e.message : 'Não foi possível excluir.';
      rota.confirmandoExclusao = false;
    } finally {
      rota.excluindo = false;
    }
  }

  progresso(rota: RotaItem): number {
    if (!rota.stopCount) return 0;
    return Math.round((rota.doneCount / rota.stopCount) * 100);
  }

  rotuloStatus(status: string): string {
    return STATUS_LABEL[status] || status || '—';
  }

  abrirExecucao(rota: RotaItem): void {
    void this.router.navigate(['/execucao', rota.id]);
  }

  abrirOs(osId: string): void {
    void this.router.navigate(['/ordens', osId]);
  }

  abrirConfig(): void {
    void this.router.navigateByUrl('/config');
  }


}
