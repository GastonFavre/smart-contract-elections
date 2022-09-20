import { EstadoVotacion } from './../../../../enums/estadoVotacion.enum';
import { Component, OnInit } from '@angular/core';
import { Bloque } from 'src/app/models/bloque.model';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { Web3Service } from 'src/app/services/contract/web3.service';

@Component({
  selector: 'app-eleccion',
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.css']
})
export class EleccionComponent implements OnInit {

  constructor(private web3Service: Web3Service,
              private alertsService: AlertsService) { }

  ngOnInit() {
  }

  public async iniciarVotacion(): Promise<void>{
    let result: Bloque | any = null;
    try {
      const ownerAddress = await this.web3Service.getContractOwner();
      result = await this.web3Service.iniciarVotacion(ownerAddress);
    } catch (error: any) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (result) {
      this.alertsService.mostrarAlertaExito(JSON.stringify(result, undefined, '\t'));
    }
  }

  public async consultarEstadoVotacion(): Promise<void>{
    let estado = null;
    try {
      const contract = await this.web3Service.consultarEstadoVotacion();
      estado = EstadoVotacion[contract];
    } catch (error) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (estado){
      await this.alertsService.alertaSimple("Estado votacion", estado);
    }
  }

  public async finalizarEleccion(): Promise<void>{
    let eleccion: Bloque | any = null;
    try {
      const ownerAddress = await this.web3Service.getContractOwner();
      eleccion = await this.web3Service.finalizarVotacion(ownerAddress);
    } catch (error) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (eleccion){
      this.alertsService.mostrarAlertaExito(JSON.stringify(eleccion, undefined, '\t'));
    }
  }

  public async resultadosVotacion(): Promise<void>{
    let ganador: Bloque | any = null;
    try {
      const ownerAddress = await this.web3Service.getContractOwner();
      ganador = await this.web3Service.anunciarGanador(ownerAddress);
    } catch (error) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (ganador){
      this.alertsService.mostrarAlertaExito(JSON.stringify(ganador, undefined, '\t'));
    }
  }

  public async consultarCandidatos(): Promise<void>{
    let cantidadCandidatos = null;
    try {
      cantidadCandidatos = await this.web3Service.consultarCantidadDeCandidatos();
    } catch (error) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (cantidadCandidatos){
      await this.alertsService.alertaSimple("Cantidad de candidatos", cantidadCandidatos);
    }
  }

}
