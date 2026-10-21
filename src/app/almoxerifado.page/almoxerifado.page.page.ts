import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,  IonInput, IonButton } from '@ionic/angular';
import { AppShellComponent } from '../app-shell/app-shell.component';
import {ItemEstoque} from '../data/modelos';
import { Dados } from '../data/dados';

@Component({
  standalone: true,
  selector: 'app-almoxerifado.page',
  templateUrl: './almoxerifado.page.page.html',
  styleUrls: ['./almoxerifado.page.page.scss'],
  imports: [AppShellComponent, IonContent,  IonInput, IonButton, CommonModule, FormsModule]
})
export class AlmoxerifadoPagePage implements OnInit {
private dados = inject(Dados);
itens: ItemEstoque[] = [];
  busca = "";
  aberto = false;
  erro = "";
  ocupado = false;
  codigo = "";
  nome = "";
  unidade = "un";
  qtd = "0";
  minimo = "0";
  endereco = "";

  constructor() { }

  async ngOnInit() {
    await this.recarregar();
  }
async recarregar() {
this.itens = await this.dados.listarEstoque();
}

filtrados(){
const q = this.busca.trim().toLowerCase();
if (!q) return this.itens;
  return this.itens.filter((item) => item.codigo.toLowerCase().includes(q) || item.nome.toLowerCase().includes(q) || item.endereco.toLowerCase().includes(q));
}

  baixo(item: ItemEstoque) {
    return item.qtd < item.minimo;
  }

  aoBuscar(evento: CustomEvent) {
    this.busca = String(evento.detail?.value ?? "");
  }

  async ajustar(id: string, delta: number) {
    await this.dados.ajustarEstoque(id, delta);
    await this.recarregar();
  }

  async salvar() {
    this.ocupado = true;
    this.erro = "";
    try {
      await this.dados.salvarItemEstoque({
        codigo: this.codigo.trim().toUpperCase(),
        nome: this.nome.trim(),
        unidade: this.unidade.trim() || "un",
        qtd: Number(this.qtd.replace(",", ".")) || 0,
        minimo: Number(this.minimo.replace(",", ".")) || 0,
        endereco: this.endereco.trim(),
        atual: Number(this.qtd.replace(",", ".")) || 0,
        local: this.endereco.trim(),
      });
      this.codigo = "";
      this.nome = "";
      this.qtd = "0";
      this.minimo = "0";
      this.endereco = "";
      this.aberto = false;
      await this.recarregar();
    } catch (err) {
      this.erro = err instanceof Error ? err.message : "Não foi possível incluir.";
    } finally {
      this.ocupado = false;
    }
  }

}
