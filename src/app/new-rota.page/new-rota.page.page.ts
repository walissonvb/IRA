import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
    IonContent, IonFooter, IonToolbar, IonButton, IonItem, IonInput,
  IonTextarea, IonSearchbar, ViewWillEnter,

 } from '@ionic/angular';
 import { AppShellComponent } from '../app-shell/app-shell.component';
export interface TecnicaCat {
  id: string;
  label: string;
  campo: string;
  unidade?: string;
}

export interface Equipe {
  id: string;
  nome: string;
  especialidade?: string;
  turno?: string;
}

export interface Maquina {
  id: string;
  tag: string;
  nome: string;
  area: string;
}

/** Catálogo embutido — pode vir do serviço depois */
const TECNICAS: TecnicaCat[] = [
  { id: 'termografia', label: 'Termografia', campo: 'Temperatura', unidade: '°C' },
  { id: 'temperatura', label: 'Temperatura de contato', campo: 'Temperatura', unidade: '°C' },
  { id: 'vibracao', label: 'Coleta de vibração', campo: 'Velocidade RMS', unidade: 'mm/s' },
  { id: 'oleo', label: 'Coleta de óleo', campo: 'Água', unidade: 'ppm' },
  { id: 'megometro', label: 'Megômetro', campo: 'Isolamento', unidade: 'MΩ' },
  { id: 'amperagem', label: 'Amperagem', campo: 'Corrente', unidade: 'A' },
  { id: 'corrente', label: 'Corrente de fuga', campo: 'Fuga', unidade: 'mA' },
  { id: 'visual', label: 'Inspeção visual', campo: 'Condição' },
  { id: 'lubrificacao', label: 'Lubrificação', campo: 'Situação' },
  { id: 'ultrassom', label: 'Ultrassom', campo: 'Nível', unidade: 'dB' },
  { id: 'espessura', label: 'Medição de espessura', campo: 'Espessura', unidade: 'mm' },
  { id: 'alinhamento', label: 'Alinhamento', campo: 'Desvio', unidade: 'mm' },
];

@Component({
  standalone: true,
  selector: 'app-new-rota.page',
  templateUrl: './new-rota.page.page.html',
  styleUrls: ['./new-rota.page.page.scss'],
  imports: [
    AppShellComponent,
    IonContent, IonFooter, IonToolbar, IonButton, IonItem, IonInput,
    IonTextarea, IonSearchbar,

  ],
})
export class NewRotaPagePage implements ViewWillEnter {
  readonly passos = ['Técnicas', 'Equipe', 'Equipamentos', 'Revisão'];
  readonly tecnicasCatalogo = TECNICAS;

  passo = 0;
  erro = '';
  ocupado = false;

  tecnicasSelecionadas: string[] = [];
  equipes: Equipe[] = [];
  equipeId = '';
  maquinas: Maquina[] = [];
  ordemIds: string[] = [];

  busca = '';
  areaFiltro = 'todas';

  nomeRota = '';
  nomeEditado = false;
  observacoes = '';

  mostrarFormEquipe = false;
  formEquipe = { nome: '', especialidade: 'Preditiva', turno: 'Manhã' };

  constructor(private router: Router) {}

  get equipeSelecionada(): Equipe | undefined {
    return this.equipes.find((e) => e.id === this.equipeId);
  }

  get areas(): string[] {
    const set = new Set(this.maquinas.map((m) => m.area).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b, 'pt'));
  }

  get maquinasVisiveis(): Maquina[] {
    const q = this.busca.trim().toLowerCase();
    return this.maquinas
      .filter((m) => this.areaFiltro === 'todas' || m.area === this.areaFiltro)
      .filter((m) => {
        if (!q) return true;
        return (
          m.tag.toLowerCase().includes(q) ||
          m.nome.toLowerCase().includes(q) ||
          (m.area || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.tag.localeCompare(b.tag, 'pt', { numeric: true }));
  }

  ionViewWillEnter(): void {
    void this.carregar();
  }

  async carregar(): Promise<void> {
    this.erro = '';
    try {
      const [equipes, maquinas] = await Promise.all([
        this.listarEquipes(),
        this.listarMaquinas(),
      ]);
      this.equipes = equipes;
      this.maquinas = maquinas;
      if (!this.equipeId && equipes[0]) this.equipeId = equipes[0].id;
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível carregar equipes e máquinas.';
    }
  }

  /** Stubs de dados — conecte ao banco */
  private async listarEquipes(): Promise<Equipe[]> {
    return [];
  }

  private async listarMaquinas(): Promise<Maquina[]> {
    return [];
  }

  private async criarEquipe(dados: {
    nome: string;
    especialidade: string;
    turno: string;
  }): Promise<Equipe> {
    throw new Error('criarEquipe ainda não conectada ao banco.');
  }

  private async criarRota(dados: {
    nome: string;
    tecnicas: string[];
    equipeId: string;
    equipeNome: string;
    maquinaIds: string[];
    observacoes: string;
  }): Promise<{ id: string }> {
    throw new Error('criarRota ainda não conectada ao banco.');
  }

  toggleTecnica(id: string): void {
    if (this.tecnicasSelecionadas.includes(id)) {
      this.tecnicasSelecionadas = this.tecnicasSelecionadas.filter((x) => x !== id);
    } else {
      this.tecnicasSelecionadas = [...this.tecnicasSelecionadas, id];
    }
    if (!this.nomeEditado) this.nomeRota = this.nomeSugerido();
  }

  toggleMaquina(id: string): void {
    if (this.ordemIds.includes(id)) return;
    this.ordemIds = [...this.ordemIds, id];
  }

  removerDaOrdem(id: string): void {
    this.ordemIds = this.ordemIds.filter((x) => x !== id);
  }

  mover(index: number, dir: -1 | 1): void {
    const target = index + dir;
    if (target < 0 || target >= this.ordemIds.length) return;
    const next = [...this.ordemIds];
    [next[index], next[target]] = [next[target], next[index]];
    this.ordemIds = next;
  }

  ordenarPorTag(): void {
    this.ordemIds = [...this.ordemIds].sort((a, b) => {
      const ta = this.maquinaPorId(a)?.tag ?? '';
      const tb = this.maquinaPorId(b)?.tag ?? '';
      return ta.localeCompare(tb, 'pt', { numeric: true });
    });
  }

  incluirVisiveis(): void {
    const ids = this.maquinasVisiveis.map((m) => m.id);
    const juntos = [...this.ordemIds];
    for (const id of ids) {
      if (!juntos.includes(id)) juntos.push(id);
    }
    this.ordemIds = juntos;
    this.ordenarPorTag();
  }

  maquinaPorId(id: string): Maquina | undefined {
    return this.maquinas.find((m) => m.id === id);
  }

  onBusca(ev: any): void {
    this.busca = ev?.detail?.value ?? '';
  }

  onNome(ev: any): void {
    this.nomeEditado = true;
    this.nomeRota = ev?.detail?.value ?? '';
  }

  nomeSugerido(): string {
    const labels = this.tecnicasSelecionadas
      .map((id) => TECNICAS.find((t) => t.id === id)?.label || id);
    const cabeca = labels.slice(0, 2).join(' e ');
    const extra = labels.length > 2 ? ` +${labels.length - 2}` : '';
    return (cabeca + extra || 'Ronda').slice(0, 80);
  }

  rotuloTecnicas(): string {
    return this.tecnicasSelecionadas
      .map((id) => TECNICAS.find((t) => t.id === id)?.label || id)
      .join(' · ') || '—';
  }

  podeAvancar(): boolean {
    if (this.passo === 0) return this.tecnicasSelecionadas.length > 0;
    if (this.passo === 1) return Boolean(this.equipeId);
    if (this.passo === 2) return this.ordemIds.length > 0;
    return this.nomeRota.trim().length > 0;
  }

  irParaPasso(i: number): void {
    if (i <= this.passo) this.passo = i;
  }

  voltar(): void {
    if (this.passo > 0) this.passo -= 1;
  }

  async continuar(): Promise<void> {
    this.erro = '';
    if (!this.podeAvancar()) return;

    if (this.passo < 3) {
      if (this.passo === 0 && !this.nomeEditado) {
        this.nomeRota = this.nomeSugerido();
      }
      this.passo += 1;
      return;
    }

    this.ocupado = true;
    try {
      const eq = this.equipeSelecionada;
      const criada = await this.criarRota({
        nome: this.nomeRota.trim(),
        tecnicas: this.tecnicasSelecionadas,
        equipeId: this.equipeId,
        equipeNome: eq?.nome || '',
        maquinaIds: this.ordemIds,
        observacoes: this.observacoes.trim(),
      });
      void this.router.navigate(['/execucao', criada.id]);
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível criar a rota.';
    } finally {
      this.ocupado = false;
    }
  }

  async salvarEquipe(ev: Event): Promise<void> {
    ev.preventDefault();
    this.erro = '';
    this.ocupado = true;
    try {
      const criada = await this.criarEquipe({ ...this.formEquipe });
      this.equipes = [...this.equipes, criada].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt'),
      );
      this.equipeId = criada.id;
      this.mostrarFormEquipe = false;
      this.formEquipe = { nome: '', especialidade: 'Preditiva', turno: 'Manhã' };
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível salvar a equipe.';
    } finally {
      this.ocupado = false;
    }
  }

}
