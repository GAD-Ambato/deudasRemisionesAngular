import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  url = 'https://aplicaciones.ambato.gob.ec:3000';
  url2 = 'https://aplicaciones.ambato.gob.ec:8443';
  urlbus="https://backfinados.ambato.gob.ec:3000";
  constructor(private _http: HttpClient) {}
  generartoken(datos: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/generarToken`,
      datos,

      { headers }
    );
  }
  consultar(cedula: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',

      'X-API-KEY': token,
    });
    // return this._http.post<any>(`${this.url2}/WsEstadoCuenta/estado/cuenta/${cedula}`
    return this._http.post<any>(
      `${this.urlbus}/sinremisionRouter/WsCuenta/estado/cuenta`,
      {
        "cedula": cedula,
        "token": token,
      },
      { headers }
    );
  }
}
