import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonButton, IonSpinner, IonButtons,
  IonBackButton, IonItem, IonTextarea, ViewWillEnter, IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  gitNetworkOutline,
  checkboxOutline,
  documentTextOutline,
  settingsOutline,
} from 'ionicons/icons';

export interface TecnicaExec {
  id: string;
  label: string;
  unidade?: string;
  tipo: 'numero' | 'escolha';
  dica?: string;
  placeholder?: string;
  opcoes?: string[];
}

export interface Parada {
  ordem: number;
  tag: string;
  nome: string;
  area?: string;
  status: 'pendente' | 'feito' | 'pulado' | string;
  observacao?: string;
  leituras?: Array<{ tecnicaId: string; valor: string; julgamento: string; unidade?: string }>;
}

export interface RotaExec {
  id: string;
  codigo?: string;
  nome: string;
  equipeNome?: string;
  status: string;
  tecnicas: TecnicaExec[];
  tecnicasLabel?: string;
  paradas: Parada[];
  osId?: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  ativo?: boolean;
}


type Rascunho = {
  observacao: string;
  valores: Record<string, string>;
  julgamentos: Record<string, string>;
};

const STATUS_ROTA: Record<string, string> = {
  planejada: 'Planejada',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
};

const STATUS_PARADA: Record<string, string> = {
  pendente: 'Pendente',
  feito: 'Feito',
  pulado: 'Pulado',
};

const JULGAMENTO: Record<string, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

@Component({
  selector: 'app-execucao.page',
  templateUrl: './execucao.page.page.html',
  styleUrls: ['./execucao.page.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonContent, IonButton, IonSpinner,
    IonButtons, IonBackButton, IonItem, IonTextarea, RouterLink,
    IonSpinner, IonIcon
  ],
})
export class ExecucaoPagePage implements ViewWillEnter {
  carregando = true;
  ocupado = false;
  erro = '';
  aviso = '';
  confirmarPulo = false;

  rota: RotaExec | null = null;
  paradaAtiva: Parada | null = null;
  rascunho: Rascunho | null = null;

  private rotaId = '';
    nav: NavItem[] = [
    { path: '/home.page', label: 'Painel', icon: 'grid-outline', exact: true },
    { path: '/rota.page', label: 'Rotas', icon: 'git-network-outline' },
    { path: '/execucao.page', label: 'Executar', icon: 'checkbox-outline' },
    { path: '/ordens', label: 'Ordens', icon: 'document-text-outline' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  get fechada(): boolean {
    return this.rota?.status === 'concluida';
  }

  get feitos(): number {
    return (this.rota?.paradas || []).filter((p) => p.status === 'feito').length;
  }

  get pulados(): number {
    return (this.rota?.paradas || []).filter((p) => p.status === 'pulado').length;
  }

  get pendentes(): number {
    return (this.rota?.paradas || []).filter((p) => p.status === 'pendente').length;
  }

  get pctGeral(): number {
    const total = this.rota?.paradas?.length || 0;
    if (!total) return 0;
    return Math.round((this.feitos / total) * 100);
  }

  get proximaTag(): string {
    if (!this.rota || !this.paradaAtiva) return '';
    const next = this.rota.paradas.find((p) => p.ordem > this.paradaAtiva!.ordem);
    return next?.tag || '';
  }

  ionViewWillEnter(): void {
    this.rotaId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.queryParamMap.get('id') ||
      '';
    void this.carregar();
  }

  async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = '';
    this.aviso = '';
    try {
      this.rota = await this.obterRota(this.rotaId);
      if (this.rota?.status === 'concluida' && this.rota.osId) {
        // opcional: redirecionar direto para OS
      }
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível abrir a rota.';
      this.rota = null;
    } finally {
      this.carregando = false;
    }
  }

  /** PONTO DE DADOS — carregue a rota pelo id */
  private async obterRota(id: string): Promise<RotaExec | null> {
    if (!id) return null;
    // Stub: retorne null ou um objeto de teste
    return null;
  }

  /** Salva leituras da parada */
  private async salvarParada(
    rotaId: string,
    ordem: number,
    dados: { leituras: Array<{ tecnicaId: string; valor: string; julgamento: string }>; observacao: string; status: string },
  ): Promise<void> {
    throw new Error('salvarParada ainda não conectada ao banco.');
  }

  /** Encerra rota e gera OS. Se pularPendentes, marca pendentes como pulado. */
  private async encerrarRota(rotaId: string, pularPendentes: boolean): Promise<{ osId: string }> {
    throw new Error('encerrarRota ainda não conectada ao banco.');
  }

  abrirParada(p: Parada): void {
    if (this.fechada) return;
    this.paradaAtiva = p;
    this.confirmarPulo = false;
    this.aviso = '';
    this.rascunho = this.montarRascunho(p);
  }

  fecharPainel(): void {
    this.paradaAtiva = null;
    this.rascunho = null;
  }

  private montarRascunho(p: Parada): Rascunho {
    const valores: Record<string, string> = {};
    const julgamentos: Record<string, string> = {};
    for (const tec of this.rota?.tecnicas || []) {
      const ant = (p.leituras || []).find((l) => l.tecnicaId === tec.id);
      const valor = ant?.valor || '';
      valores[tec.id] = valor;
      julgamentos[tec.id] = ant?.julgamento || this.sugerirJulgamento(tec.id, valor);
    }
    return { observacao: p.observacao || '', valores, julgamentos };
  }

  escolher(tecnicaId: string, opcao: string): void {
    if (!this.rascunho) return;
    this.rascunho.valores[tecnicaId] = opcao;
    this.rascunho.julgamentos[tecnicaId] = this.sugerirJulgamento(tecnicaId, opcao);
  }

  digitar(tecnicaId: string, ev: Event): void {
    if (!this.rascunho) return;
    const valor = (ev.target as HTMLInputElement)?.value ?? '';
    this.rascunho.valores[tecnicaId] = valor;
    this.rascunho.julgamentos[tecnicaId] = this.sugerirJulgamento(tecnicaId, valor);
  }

  obsChange(ev: any): void {
    if (!this.rascunho) return;
    this.rascunho.observacao = ev?.detail?.value ?? '';
  }

  /** Ajuste limites conforme seu catálogo */
  private sugerirJulgamento(_tecnicaId: string, _valor: string): string {
    return 'normal';
  }

  async salvar(): Promise<void> {
    if (!this.rota || !this.paradaAtiva || !this.rascunho) return;
    this.ocupado = true;
    this.erro = '';
    try {
      const leituras = (this.rota.tecnicas || []).map((t) => ({
        tecnicaId: t.id,
        valor: (this.rascunho!.valores[t.id] || '').trim(),
        julgamento: this.rascunho!.julgamentos[t.id] || 'normal',
      }));
      const ordem = this.paradaAtiva.ordem;
      await this.salvarParada(this.rota.id, ordem, {
        leituras,
        observacao: this.rascunho.observacao,
        status: 'feito',
      });
      await this.carregar();
      this.avancar(ordem);
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível salvar.';
    } finally {
      this.ocupado = false;
    }
  }

  async pular(): Promise<void> {
    if (!this.rota || !this.paradaAtiva) return;
    this.ocupado = true;
    this.erro = '';
    try {
      const ordem = this.paradaAtiva.ordem;
      await this.salvarParada(this.rota.id, ordem, {
        leituras: [],
        observacao: this.rascunho?.observacao || '',
        status: 'pulado',
      });
      await this.carregar();
      this.avancar(ordem);
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível pular.';
    } finally {
      this.ocupado = false;
    }
  }

  private avancar(ordemAtual: number): void {
    const proxima = (this.rota?.paradas || []).find((p) => p.ordem > ordemAtual);
    if (!proxima) {
      this.paradaAtiva = null;
      this.rascunho = null;
      this.aviso = 'Fim da sequência. Gere a ordem de serviço quando quiser encerrar.';
      return;
    }
    this.abrirParada(proxima);
  }

  async encerrar(pularPendentes: boolean): Promise<void> {
    if (!this.rota) return;
    if (this.pendentes > 0 && !pularPendentes) {
      this.confirmarPulo = true;
      return;
    }
    this.ocupado = true;
    this.erro = '';
    try {
      const res = await this.encerrarRota(this.rota.id, pularPendentes);
      void this.router.navigate(['/ordens', res.osId]);
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível gerar a OS.';
    } finally {
      this.ocupado = false;
    }
  }

  abrirOs(): void {
    if (this.rota?.osId) {
      void this.router.navigate(['/ordens', this.rota.osId]);
    }
  }

  rotuloStatus(s: string): string {
    return STATUS_ROTA[s] || s || '—';
  }

  rotuloParada(s: string): string {
    return STATUS_PARADA[s] || s || '—';
  }

  rotuloJulgamento(s: string): string {
    return JULGAMENTO[s] || s || '—';
  }
    abrirConfig(): void {
    void this.router.navigateByUrl('/config');
  }

}
