
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { provider } from 'web3-core';
import * as contractABI from '../../../../../../smart-contract/build/contracts/Election.json';
import electionsABI from '../../core/contracts-abi/election.json'

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public accountsObservable = new Subject<string[]>();
  web3Modal;
  web3js:  any;
  provider: provider | undefined;
  accounts: string[] | undefined;
  balance: string | undefined;

  constructor() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required | aqui importamos el paquete que nos ayudara a usar soportar distintas wallets
        options: {
          infuraId: 'env', // cambia esto con tu apikey de infura
          description: 'Scan the qr code and sign in', // Puedes camnbiar los textos descriptivos en la seccion description
          qrcodeModalOptions: {
            mobileLinks: [
              'rainbow',
              'metamask',
              'argent',
              'trust',
              'imtoken',
              'pillar'
            ]
          }
        }
      },
      injected: {
        display: {
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          name: 'metamask',
          description: "Connect with the provider in your Browser"
        },
        package: null
      },
    };

    this.web3Modal = new Web3Modal({
      network: "Ganache", // puedes cambiar a una red de pruebas o etc
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }

  public async getAllAccounts(): Promise<any>{
    this.web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    const accounts = await this.web3js.eth.personal.getAccounts();
    return accounts;
  }

  public async getContractOwner(): Promise<any>{
    const contract = await this.connectContract();
    const ad = await contract.methods.owner().call();
    return ad;
  }

  public async payFee(direccionWallet: string): Promise<string | null>{
    const contract = await this.connectContract();
    const addC = await contract.methods.payFee().send({from: direccionWallet, value: 1000000000000000000});
    if (addC?.transactionHash)
      return addC;
    return null;
  }

  public async agregarCandidato(direccionWallet: string, nombre: string, contractOwner: string): Promise<any>{
    const contract = await this.connectContract();
    const candidatoAgregado = await contract.methods.addCandidate(direccionWallet, nombre).send({from: contractOwner});
    return candidatoAgregado;
  }

  public async registrarVotante(direccionWallet: string, contractOwner: string): Promise<any>{
    const contract = await this.connectContract();
    const votanteRegistrado = await contract.methods.registerVoter(direccionWallet).send({from: contractOwner});
    return votanteRegistrado;
  }

  public async accountInfo(account: any[]): Promise<string | undefined>{
    const initialvalue = await this.web3js.eth.getBalance(account[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
    return this.balance;
  }

  public async connectContract(): Promise<any>{
    let contract: any = null;
    const direccionDelContrato = contractABI.networks[5777].address;
    try {
      this.web3js = new Web3(window.web3.currentProvider);
      contract = new this.web3js.eth.Contract(electionsABI, direccionDelContrato);
    } catch (error) {
      console.error(error)
    }
    return contract;
  }

  public async connectAccount(): Promise<provider | undefined> {
    try {
      this.provider = await this.web3Modal.connect(); // set provider
      if (this.provider) {
        this.web3js = new Web3(this.provider);
      } // create web3 instance
    } catch (error) {
      console.log(error)
    }
    return this.web3js;
  }

  public async iniciarVotacion(owner: string): Promise<void>{
    let votation: any = null;
    const contract = await this.connectContract();
    try {
      votation = await contract.methods.startVote().send({from: owner});
    } catch (error) {
      console.log(error)
    }
    return votation
  }

  public async finalizarVotacion(owner: string): Promise<void>{
    let votation: any = null;
    const contract = await this.connectContract();
    try {
      votation = await contract.methods.endVote().send({from: owner});
    } catch (error) {
      console.log(error)
    }
    return votation
  }

  public async consultarEstadoVotacion(): Promise<any>{
    let stateVotation: any = null;
    const contract = await this.connectContract();
    try {
      stateVotation = await contract.methods.state().call();
    } catch (error) {
      console.log(error)
    }
    return stateVotation;
  }

  public async anunciarGanador(owner: string): Promise<any>{
    let ganador: any = null;
    const contract = await this.connectContract();
    try {
      ganador = await contract.methods.announceWinner().call({from: owner});
    } catch (error) {
      console.log(error);
    }
    return ganador;
  }

  public async votar(direccionCandidato: string, direccionVotante: string): Promise<any>{
    let voto: any = null;
    const contract = await this.connectContract();
    try {
      voto = await contract.methods.vote(direccionCandidato).send({from: direccionVotante});
    } catch (error) {
      console.log(error)
    }
    return voto;
  }

  public async consultarCantidadDeCandidatos(){
    let totalCandidatos: any = null;
    const contract = await this.connectContract();
    try {
      totalCandidatos = await contract.methods.getTotalCandidates().call();
    } catch (error) {
      console.log(error)
    }
    return totalCandidatos;
  }


}
