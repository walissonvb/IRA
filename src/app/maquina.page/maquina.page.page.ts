import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonInput, IonSelect, IonSelectOption, IonTextarea } from "@ionic/angular";
import {AppShellComponent} from '../app-shell/app-shell.component';
import { Dados } from '../data/dados';
import { Maquina, ROTULO_STATUS_MAQUINA } from '../data/modelos';

type Status = 'Disponível' | 'Em rota' | 'Manutenção';

@Component({
  standalone: true,
  selector: 'app-maquina.page',
  templateUrl: './maquina.page.page.html',
  styleUrls: ['./maquina.page.page.scss'],
  imports: [AppShellComponent,  IonButton, IonContent, IonInput, IonSelect, IonSelectOption, IonTextarea, CommonModule, FormsModule]
})
export class MaquinaPagePage implements OnInit {
  private dados = inject(Dados);

  maquinas: Maquina[] = [];
  busca = "";
  selecionada: Maquina | null = null;
  modo: "lista" | "form" = "lista";
  editando = false;
  erro = "";
  ocupado = false;
  confirmar = false;
  tag = "";
  nome = "";
  area = "";
  criticidade: "A" | "B" | "C" = "B";
  status: "operando" | "atencao" | "parado" = "operando";
  notas = "";
  pecaCodigo = "";
  pecaNome = "";
  pecaQtd = "1";
  readonly statusLabel = ROTULO_STATUS_MAQUINA;

  async ngOnInit() {
    await this.recarregar();
  }

  async recarregar() {
    this.maquinas = await this.dados.listarMaquinas();
    if (this.selecionada) this.selecionada = this.maquinas.find((item) => item.id === this.selecionada?.id) ?? null;
  }

  filtradas() {
    const q = this.busca.trim().toLowerCase();
    if (!q) return this.maquinas;
    return this.maquinas.filter((item) => item.tag.toLowerCase().includes(q) || item.nome.toLowerCase().includes(q) || item.area.toLowerCase().includes(q));
  }

  aoBuscar(evento: CustomEvent) {
    this.busca = String(evento.detail?.value ?? "");
  }

  nova() {
    this.selecionada = null;
    this.editando = false;
    this.modo = "form";
    this.tag = "";
    this.nome = "";
    this.area = "";
    this.criticidade = "B";
    this.status = "operando";
    this.notas = "";
    this.erro = "";
  }

  abrir(maquina: Maquina) {
    this.selecionada = maquina;
    this.modo = "lista";
    this.confirmar = false;
  }

  editar() {
    if (!this.selecionada) return;
    this.tag = this.selecionada.tag;
    this.nome = this.selecionada.nome;
    this.area = this.selecionada.area;
    this.criticidade = this.selecionada.criticidade ?? "B";
    this.status = this.selecionada.status ?? "operando";
    this.notas = this.selecionada.notas ?? "";
    this.editando = true;
    this.modo = "form";
  }

  async salvar() {
    this.ocupado = true;
    this.erro = "";
    try {
      const salva = await this.dados.salvarMaquina({
        id: this.editando ? this.selecionada?.id : undefined,
        tag: this.tag.trim(),
        nome: this.nome.trim(),
        area: this.area.trim(),
        criticidade: this.criticidade,
        status: this.status,
        notas: this.notas.trim(),
      });
      await this.recarregar();
      this.selecionada = this.maquinas.find((item) => item.id === salva.id) ?? salva;
      this.modo = "lista";
    } catch (err) {
      this.erro = err instanceof Error ? err.message : "Não foi possível salvar.";
    } finally {
      this.ocupado = false;
    }
  }

  async excluir() {
    if (!this.selecionada) return;
    this.ocupado = true;
    try {
      await this.dados.excluirMaquina(this.selecionada.id);
      this.selecionada = null;
      this.confirmar = false;
      await this.recarregar();
    } catch (err) {
      this.erro = err instanceof Error ? err.message : "Não foi possível excluir.";
    } finally {
      this.ocupado = false;
    }
  }

  async adicionarPeca() {
    if (!this.selecionada) return;
    await this.dados.salvarPeca(this.selecionada.id, { codigo: this.pecaCodigo.trim(), nome: this.pecaNome.trim(), qtd: Number(this.pecaQtd) || 1 });
    this.pecaCodigo = "";
    this.pecaNome = "";
    this.pecaQtd = "1";
    await this.recarregar();
  }

  async tirarPeca(id: string) {
    if (!this.selecionada) return;
    await this.dados.excluirPeca(this.selecionada.id, id);
    await this.recarregar();
  }
}
