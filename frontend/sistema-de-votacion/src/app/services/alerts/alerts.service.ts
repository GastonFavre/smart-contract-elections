import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }


  public async mostrarAlertaError(info: any): Promise<void | SweetAlertResult<any>> {
    let res;
    if (info?.data) {
      const keys = Object.keys(info.data)
      res = await Swal.fire('Error', info?.data[keys[0]].reason, 'error');
    } else {
      console.error(info)
    }
    return res;
  }

  public async mostrarAlertaExito(info: any): Promise<SweetAlertResult<any>> {
    const salida = this.crearSalida(info)
    const res = await Swal.fire('Éxito', salida, 'success');
    return res;
  }

  public async alertaSimple(titulo: string, texto: string): Promise<SweetAlertResult<any>>{
    const res = await Swal.fire(titulo, texto, 'info');
    return res;
  }

  private crearSalida(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        }
        else {
          cls = 'string';
        }
      }
      else if (/true|false/.test(match)) {
        cls = 'boolean';
      }
      else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

}
