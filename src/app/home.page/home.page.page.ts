
import { Component, OnInit, inject} from '@angular/core';
import { AppShellComponent } from '../app-shell/app-shell.component';
import { Router } from '@angular/router';
import {
  IonProgressBar,
  IonContent,
  IonButton,
 
   } from '@ionic/angular';

import { Alerta, Rota, ROTULO_JULGAMENTO, ROTULO_STATUS_ROTA, rotuloTecnica} from '../data/modelos';
import { Dados } from '../data/dados';


@Component({
  selector: 'app-home.page',
  templateUrl: './home.page.page.html',
  styleUrls: ['./home.page.page.scss'],
  standalone: true,
  imports: [
    AppShellComponent,
    IonContent,
    IonButton,
    IonProgressBar
  ],
})
export class HomePagePage implements OnInit {
  private dados = inject(Dados);
  private router = inject(Router);

  hoje = "";
  maquinas = 0;
  rotasAbertas = 0;
  osAbertas = 0;
  abaixoMinimo = 0;
  rotas: Rota[] = [];
  alertas: Alerta[] = [];
  erro = "";
  readonly statusRota = ROTULO_STATUS_ROTA;
  readonly julgamento = ROTULO_JULGAMENTO;

  async ngOnInit() {
    try {
      const painel = await this.dados.obterDashboard();
      this.hoje = painel.hoje;
      this.maquinas = painel.maquinas;
      this.rotasAbertas = painel.rotasAbertas;
      this.osAbertas = painel.osAbertas;
      this.abaixoMinimo = painel.abaixoMinimo;
      this.rotas = painel.rotas;
      this.alertas = painel.alertas;
    } catch (err) {
      this.erro = err instanceof Error ? err.message : "Não foi possível abrir o painel.";
    }
  }

  feitos(rota: Rota) {
    return rota.paradas.filter((item) => item.status === "feito").length;
  }

  progresso(rota: Rota) {
    return rota.paradas.length ? this.feitos(rota) / rota.paradas.length : 0;
  }

  leitura(alerta: Alerta) {
    return `${rotuloTecnica(alerta.tecnicaId)} · ${alerta.valor}${alerta.unidade ? ` ${alerta.unidade}` : ""}`;
  }

  ir(url: string) {
    void this.router.navigateByUrl(url);
  }
  }




