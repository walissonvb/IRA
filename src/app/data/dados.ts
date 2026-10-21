import { Injectable } from '@angular/core';
import {
  Alerta,
  Equipe,
  ItemEstoque,
  Julgamento,
  Leitura,
  Maquina,
  NovaRotaInput,
  Ordem,
  Parada,
  Peca,
  Rota,
  rotuloTecnica,
  sugerirJulgamento,
  tecnicaPorId,
} from './modelos';

/** Memória local. Troque o corpo de cada método pelo Firebase. */
@Injectable({ providedIn: 'root' })
export class Dados {
  private seq = 20;

  private maquinas: Maquina[] = [
    { id: 'm-cr012', tag: 'CR-012', nome: 'Correia transportadora', area: 'Britagem', criticidade: 'A', status: 'atencao', notas: 'Rolete de retorno com ruído', pecas: [{ id: 'p1', codigo: 'ROL-RET', nome: 'Rolete de retorno', qtd: 18 }] },
    { id: 'm-m210', tag: 'M-210', nome: 'Motor 250 cv do moinho', area: 'Moagem', criticidade: 'A', status: 'operando', notas: '', pecas: [{ id: 'p2', codigo: 'ROL-6316', nome: 'Rolamento 6316', qtd: 2 }] },
    { id: 'm-p101', tag: 'P-101', nome: 'Bomba de polpa', area: 'Moagem', criticidade: 'A', status: 'operando', notas: '', pecas: [] },
    { id: 'm-p102', tag: 'P-102', nome: 'Bomba de reserva', area: 'Moagem', criticidade: 'B', status: 'parado', notas: 'Fora de operação', pecas: [] },
    { id: 'm-rd033', tag: 'RD-033', nome: 'Redutor principal', area: 'Moagem', criticidade: 'A', status: 'operando', notas: '', pecas: [] },
    { id: 'm-ve088', tag: 'VE-088', nome: 'Exaustor do forno', area: 'Calcinação', criticidade: 'A', status: 'atencao', notas: 'Mancal LA aquecendo', pecas: [] },
    { id: 'm-cp014', tag: 'CP-014', nome: 'Compressor de ar', area: 'Utilidades', criticidade: 'B', status: 'operando', notas: '', pecas: [] },
    { id: 'm-vn055', tag: 'VN-055', nome: 'Ventilador da torre', area: 'Utilidades', criticidade: 'C', status: 'operando', notas: '', pecas: [] },
    { id: 'm-tr004', tag: 'TR-004', nome: 'Transformador SE-02', area: 'Subestação', criticidade: 'A', status: 'atencao', notas: 'Isolamento da fase B baixo', pecas: [] },
    { id: 'm-mcc02', tag: 'MCC-02', nome: 'CCM linha 2', area: 'Elétrica', criticidade: 'B', status: 'operando', notas: '', pecas: [] },
    { id: 'm-ag007', tag: 'AG-007', nome: 'Agitador do tanque', area: 'Lixiviação', criticidade: 'B', status: 'operando', notas: '', pecas: [] },
    { id: 'm-tc201', tag: 'TC-201', nome: 'Trocador de calor', area: 'Utilidades', criticidade: 'C', status: 'operando', notas: '', pecas: [] },
  ];

  private equipes: Equipe[] = [
    { id: 'eq-a', nome: 'Preditiva A', especialidade: 'Preditiva', turno: '1º' },
    { id: 'eq-b', nome: 'Mecânica B', especialidade: 'Mecânica', turno: '2º' },
    { id: 'eq-c', nome: 'Elétrica C', especialidade: 'Elétrica', turno: '1º' },
  ];

  private rotas: Rota[] = [];
  private ordens: Ordem[] = [];
  private estoque: ItemEstoque[] = [
    { id: 'e1', codigo: 'ROL-RET', nome: 'Rolete de retorno', unidade: 'un', minimo: 10, atual: 8, local: 'Almox A' , qtd: 1, endereco: 'A-01'},
    { id: 'e2', codigo: 'ROL-6316', nome: 'Rolamento 6316', unidade: 'un', minimo: 4, atual: 2, local: 'Almox A' , qtd: 1, endereco: 'A-01'},
    { id: 'e3', codigo: 'OLE-320', nome: 'Óleo ISO 320', unidade: 'L', minimo: 20, atual: 45, local: 'Almox B' , qtd: 1, endereco: 'A-01'},
    { id: 'e4', codigo: 'VED-50', nome: 'Vedação 50 mm', unidade: 'un', minimo: 6, atual: 12, local: 'Almox A' , qtd: 1, endereco: 'A-01'},
  ];
  private monitor: Alerta[] = [];

  private id(prefixo: string) {
    this.seq += 1;
    return `\( {prefixo}- \){this.seq}`;
  }

  private hojeLabel() {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
  }

  // ── Dashboard ──────────────────────────────────────────
  async obterDashboard() {
    const abertas = this.rotas.filter((r) => r.status === 'planejada' || r.status === 'concluida');
    return {
      hoje: this.hojeLabel(),
      maquinas: this.maquinas.length,
      rotasAbertas: abertas.length,
      osAbertas: this.ordens.filter((o) => o.status === 'aberta' || o.status === 'em_andamento').length,
      abaixoMinimo: this.estoque.filter((e) => e.atual < e.minimo).length,
      rotas: abertas,
      alertas: this.monitor.slice(0, 8),
    };
  }

  // ── Máquinas ───────────────────────────────────────────
  async listarMaquinas() {
    return [...this.maquinas];
  }

  async salvarMaquina(entrada: Partial<Maquina> & { tag: string; nome: string; area: string }) {
    if (entrada.id) {
      const i = this.maquinas.findIndex((m) => m.id === entrada.id);
      if (i >= 0) this.maquinas[i] = { ...this.maquinas[i], ...entrada };
      return this.maquinas[i];
    }
    const nova: Maquina = {
      id: this.id('m'),
      tag: entrada.tag,
      nome: entrada.nome,
      area: entrada.area,
      criticidade: entrada.criticidade ?? 'B',
      status: entrada.status ?? 'operando',
      notas: entrada.notas ?? '',
      pecas: entrada.pecas ?? [],
    };
    this.maquinas.push(nova);
    return nova;
  }

  async excluirMaquina(id: string) {
    this.maquinas = this.maquinas.filter((m) => m.id !== id);
  }

  async salvarPeca(maquinaId: string, peca: Omit<Peca, 'id'>) {
    const m = this.maquinas.find((x) => x.id === maquinaId);
    if (!m) return;
    m.pecas = m.pecas ?? [];
    m.pecas.push({ ...peca, id: this.id('p') });
  }

  async excluirPeca(maquinaId: string, pecaId: string) {
    const m = this.maquinas.find((x) => x.id === maquinaId);
    if (!m?.pecas) return;
    m.pecas = m.pecas.filter((p) => p.id !== pecaId);
  }

  // ── Equipes ────────────────────────────────────────────
  async listarEquipes() {
    return [...this.equipes];
  }

  async salvarEquipe(equipe: Omit<Equipe, 'id'>) {
    const nova = { ...equipe, id: this.id('eq') };
    this.equipes.push(nova);
    return nova;
  }

  // ── Rotas ──────────────────────────────────────────────
  async listarRotas() {
    return [...this.rotas];
  }

  async obterRota(id: string) {
    return this.rotas.find((r) => r.id === id) ?? null;
  }

  async salvarRota(entrada: NovaRotaInput) {
    const equipe = this.equipes.find((e) => e.id === entrada.equipeId);
    const paradas: Parada[] = entrada.maquinaIds.map((mid, i) => {
      const m = this.maquinas.find((x) => x.id === mid)!;
      return {
        ordem: i + 1,
        maquinaId: m.id,
        tag: m.tag,
        nome: m.nome,
        area: m.area,
        status: 'pendente',
        observacao: '',
      };
    });
    const rota: Rota = {
      id: this.id('r'),
      code: `RT-${String(this.seq).padStart(3, '0')}`,
      nome: entrada.nome,
      equipeId: entrada.equipeId,
      equipeNome: equipe?.nome ?? '',
      observacoes: entrada.observacoes ?? '',
      tecnicas: entrada.tecnicas,
      status: 'concluida',
      paradas,
      leituras: [],
      osId: this.hojeLabel(),
    };
    this.rotas.unshift(rota);
    return rota;
  }

  async excluirRota(id: string) {
    this.rotas = this.rotas.filter((r) => r.id !== id);
  }

  async salvarParada(
    rotaId: string,
    ordem: number,
    leitura: { observacao: string; status: Parada['status']; leituras: Leitura[] },
  ) {
    const rota = this.rotas.find((r) => r.id === rotaId);
    if (!rota) return;
    const p = rota.paradas.find((x) => x.ordem === ordem);
    if (!p) return;
    p.status = leitura.status;
    p.observacao = leitura.observacao;
    rota.leituras = rota.leituras.filter((l) => l.ordem !== ordem).concat(leitura.leituras);
    if (rota.status === 'concluida') rota.status = 'em_execucao';
  }

  async pularPendentes(rotaId: string) {
    const rota = this.rotas.find((r) => r.id === rotaId);
    if (!rota) return;
    for (const p of rota.paradas) {
      if (p.status === 'pendente') p.status = 'pulado';
    }
  }

  async encerrarRota(rotaId: string, pularPendentes = false) {
    const rota = this.rotas.find((r) => r.id === rotaId);
    if (!rota) return;
    if (pularPendentes) await this.pularPendentes(rotaId);
    rota.status = 'concluida';
  }

  // ── Ordens de serviço ──────────────────────────────────
  async listarOrdens() {
    return [...this.ordens];
  }

  async obterOrdem(id: string) {
    return this.ordens.find((o) => o.id === id) ?? null;
  }

  async abrirOrdem(entrada: Omit<Ordem, 'id' | 'code' | 'openedLabel' | 'origin' | 'status'>) {
    const os: Ordem = {
      ...entrada,
      id: this.id('os'),
      code: `OS-${String(this.seq).padStart(3, '0')}`,
      openedLabel: this.hojeLabel(),
      origin: 'manual',
      status: 'aberta',
    };
    this.ordens.unshift(os);
    return os;
  }

  async atualizarStatusOs(id: string, status: Ordem['status']) {
    const o = this.ordens.find((x) => x.id === id);
    if (o) o.status = status;
  }

  // ── Estoque ────────────────────────────────────────────
  async listarEstoque() {
    return [...this.estoque];
  }

  async salvarItemEstoque(entrada: Omit<ItemEstoque, 'id'>) {
    const item = { ...entrada, id: this.id('e') };
    this.estoque.push(item);
    return item;
  }

  async ajustarEstoque(id: string, delta: number) {
    const item = this.estoque.find((e) => e.id === id);
    if (item) item.atual = Math.max(0, item.atual + delta);
  }

  // ── Monitoramento ──────────────────────────────────────
  async listarMonitor(maquinaId = '') {
    return maquinaId ? this.monitor.filter((a) => a.maquinaId === maquinaId) : [...this.monitor];
  }

  async salvarMonitor(entrada: {
    maquinaId: string;
    tecnicaId: string;
    valor: string;
    julgamento: Julgamento;
    observacao: string;
  }) {
    const m = this.maquinas.find((x) => x.id === entrada.maquinaId);
    const t = tecnicaPorId(entrada.tecnicaId);
    const alerta: Alerta = {
      id: this.id('a'),
      maquinaId: entrada.maquinaId,
      tag: m?.tag ?? '',
      nome: m?.nome ?? '',
      tecnicaId: t?.label ?? entrada.tecnicaId,
      valor: entrada.valor,
      unidade: t?.unidade ?? '',
      julgamento: entrada.julgamento,
      quando: this.hojeLabel(),
      origem: 'monitor',
    };
    this.monitor.unshift(alerta);
    return alerta;
  }
}