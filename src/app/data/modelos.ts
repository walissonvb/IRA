export type Julgamento = "normal" | "atencao" | "critico";
export type StatusRota = "planejada" | "em_execucao" | "concluida";
export type StatusParada = "pendente" | "feito" | "pulado";
export type TipoOs = "corretiva" | "preventiva" | "preditiva";
export type OrigemOs = "manual" | "rota" | "monitoramento";
export type StatusOs = "aberta" | "em_andamento" | "concluida" | "cancelada";
export type PrioridadeOs = "baixa" | "media" | "alta" | "urgente";

export interface Tecnica {
  id: string;
  label: string;
  campo: string;
  unidade: string;
  tipo: "numero" | "escolha";
  dica: string;
  placeholder?: string;
  opcoes?: string[];
  julgamento?: Record<string, Julgamento>;
  piorAlto?: boolean;
  atencao?: number;
  critico?: number;
}

export interface Maquina {
  id: string;
  tag: string;
  nome: string;
  area: string;
  criticidade?: "A" | "B" | "C";
  status?: "operando" | "atencao" | "parado";
  notas?: string;
  pecas?: Peca[];
}

export interface Peca {
  id: string;
  codigo: string;
  nome: string;
  qtd: number;
}

export interface Equipe {
  id: string;
  nome: string;
  especialidade: string;
  turno: string;
}

export interface Parada {
  ordem: number;
  maquinaId: string;
  tag: string;
  nome: string;
  area: string;
  status: StatusParada;
  observacao: string;
}

export interface Leitura {
  ordem: number;
  tecnicaId: string;
  campo: string;
  valor: string;
  unidade: string;
  julgamento: Julgamento;
}

export interface Rota {
  id: string;
  code?: string;
  nome: string;
  tecnicas: string[];
  equipeId: string;
  equipeNome: string;
  observacoes: string;
  status: StatusRota;
  paradas: Parada[];
  leituras: Leitura[];
  osId?: string;
}

export interface LinhaOs {
  id: string;
  machineTag: string;
  machineName: string;
  technique: string;
  reading: string;
  judgment: Julgamento;
  notes: string;
}

export interface Ordem {
  id: string;
  code: string;
  openedLabel: string;
  type: TipoOs;
  origin: OrigemOs;
  status: StatusOs;
  priority: PrioridadeOs;
  requester: string;
  teamName: string;
  area: string;
  title: string;
  description: string;
  lines: LinhaOs[];
}

export interface NovaRotaInput {
  nome: string;
  tecnicas: string[];
  equipeId: string;
  observacoes: string;
  maquinaIds: string[];
}

export const TECNICAS: Tecnica[] = [
  { id: "termografia", label: "Termografia", campo: "Temperatura", unidade: "°C", tipo: "numero", dica: "Ponto mais quente. Atenção a partir de 70 °C.", placeholder: "64", piorAlto: true, atencao: 70, critico: 90 },
  { id: "vibracao", label: "Coleta de vibração", campo: "Velocidade RMS", unidade: "mm/s", tipo: "numero", dica: "Maior amplitude. Referência simplificada da ISO 10816.", placeholder: "2,8", piorAlto: true, atencao: 4.5, critico: 7.1 },
  { id: "oleo", label: "Coleta de óleo", campo: "Água", unidade: "ppm", tipo: "numero", dica: "Água no lubrificante.", placeholder: "80", piorAlto: true, atencao: 200, critico: 500 },
  { id: "megometro", label: "Megômetro", campo: "Isolamento", unidade: "MΩ", tipo: "numero", dica: "Menor fase. Abaixo de 100 MΩ pede atenção.", placeholder: "250", piorAlto: false, atencao: 100, critico: 10 },
  { id: "amperagem", label: "Amperagem", campo: "Corrente", unidade: "A", tipo: "numero", dica: "Corrente de carga. Compare com a placa.", placeholder: "42" },
  { id: "corrente", label: "Corrente de fuga", campo: "Fuga", unidade: "mA", tipo: "numero", dica: "Fuga à terra. Atenção a partir de 10 mA.", placeholder: "1,2", piorAlto: true, atencao: 10, critico: 30 },
  { id: "visual", label: "Inspeção visual", campo: "Condição", unidade: "", tipo: "escolha", dica: "Vazamento, fixação, guarda, ruído e sujeira.", opcoes: ["Conforme", "Atenção", "Não conforme"], julgamento: { Conforme: "normal", Atenção: "atencao", "Não conforme": "critico" } },
  { id: "lubrificacao", label: "Lubrificação", campo: "Situação", unidade: "", tipo: "escolha", dica: "Ponto lubrificado nesta passagem.", opcoes: ["Aplicada", "Parcial", "Não aplicada"], julgamento: { Aplicada: "normal", Parcial: "atencao", "Não aplicada": "critico" } },
  { id: "ultrassom", label: "Ultrassom", campo: "Nível", unidade: "dB", tipo: "numero", dica: "Maior leitura no ponto.", placeholder: "15", piorAlto: true, atencao: 25, critico: 40 },
  { id: "espessura", label: "Medição de espessura", campo: "Espessura", unidade: "mm", tipo: "numero", dica: "Menor espessura. Compare com a nominal.", placeholder: "8,0", piorAlto: false, atencao: 6, critico: 3 },
  { id: "alinhamento", label: "Alinhamento", campo: "Desvio", unidade: "mm", tipo: "numero", dica: "Desvio residual do acoplamento.", placeholder: "0,05", piorAlto: true, atencao: 0.1, critico: 0.3 },
];

export const ROTULO_JULGAMENTO: Record<Julgamento, string> = { normal: "Normal", atencao: "Atenção", critico: "Crítico" };
export const ROTULO_TIPO: Record<TipoOs, string> = { corretiva: "Corretiva", preventiva: "Preventiva", preditiva: "Preditiva" };
export const ROTULO_ORIGEM: Record<OrigemOs, string> = { manual: "Abertura manual", rota: "Rota preditiva", monitoramento: "Monitoramento" };
export const ROTULO_STATUS_OS: Record<StatusOs, string> = { aberta: "Aberta", em_andamento: "Em andamento", concluida: "Concluída", cancelada: "Cancelada" };
export const ROTULO_STATUS_ROTA: Record<StatusRota, string> = { planejada: "Planejada", em_execucao: "Em execução", concluida: "Concluída" };
export const ROTULO_STATUS_PARADA: Record<StatusParada, string> = { pendente: "Pendente", feito: "Feito", pulado: "Pulado" };
export const ROTULO_STATUS_MAQUINA: Record<"operando" | "atencao" | "parado", string> = { operando: "Operando", atencao: "Atenção", parado: "Parado" };
export const ROTULO_PRIORIDADE: Record<PrioridadeOs, string> = { baixa: "Baixa", media: "Média", alta: "Alta", urgente: "Urgente" };

export function tecnicaPorId(id: string): Tecnica | undefined {
  return TECNICAS.find((item) => item.id === id);
}

export function rotuloTecnica(id: string): string {
  return tecnicaPorId(id)?.label ?? id;
}

export function sugerirJulgamento(id: string, bruto: string): Julgamento {
  const tec = tecnicaPorId(id);
  if (!tec) return "normal";
  if (tec.tipo === "escolha") return tec.julgamento?.[bruto] ?? "normal";
  if (tec.atencao == null || tec.critico == null) return "normal";
  const valor = Number(String(bruto).replace(",", ".").trim());
  if (!Number.isFinite(valor)) return "normal";
  if (tec.piorAlto === false) {
    if (valor <= tec.critico) return "critico";
    if (valor <= tec.atencao) return "atencao";
    return "normal";
  }
  if (valor >= tec.critico) return "critico";
  if (valor >= tec.atencao) return "atencao";
  return "normal";
}

export interface ItemEstoque {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  qtd: number;
  minimo: number;
  endereco: string;
  atual: number;
  local: string
}

export interface Lancamento {
  id: string;
  maquinaId: string;
  tag: string;
  nome: string;
  tecnicaId: string;
  valor: string;
  unidade: string;
  julgamento: Julgamento;
  observacao: string;
  quando: string;
}

export interface Alerta {
  id: string;
  maquinaId: string;
  tag: string;
  nome: string;
  tecnicaId: string;
  valor: string;
  unidade: string;
  julgamento: Julgamento;
  quando: string;
  origem: "rota" | "monitor";
}
