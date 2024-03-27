import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalremisiones = 0.0;
  totalsinremision = 0.0;
  totalconremision = 0.0;
  aparecetabla = false;
  token = '';
  apareceTabla = false;
  arrayaumentado: any;
  arrayRespuesta = [];
  arrayCuentasSeleccionadas = [];
  seleccionar = 'seleccionar';

  habilitatecladovirtual = false;

  miFormulario!: FormGroup;
  ngOnInit(): void {
    this.crearFormulario();
    this.generartoken();
  }

  generartoken() {
    const data = {
      idusuario: 21,
      perfil: 'LPUL2023',
      roles: ['get', 'post', 'put', 'delete'],
    };
    this._homeservice.generartoken(data).subscribe((resp) => {
      console.log('token==:' + JSON.stringify(resp));
      this.token = resp['token'];
      this.token = resp['token'];
      // console.log('generartoken' + JSON.stringify( resp));
      // localStorage.removeItem('LStoken');
      // localStorage.setItem('LStoken', JSON.stringify(resp["token"]));
    });
  }
  crearFormulario() {
    console.log('Crear formulario');

    this.miFormulario = this.formBuilder.group({
      fcncedula: ['', Validators.required],
    });
  }

  constructor(
    private _homeservice: HomeService,
    private router: Router,
    private service: HomeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  nuevaConsulta() {
    location.reload();
  }
  consultar() {
  this.spinner.show();
    this.aparecetabla = true;
    this._homeservice
      .consultar(this.miFormulario.value.fcncedula, this.token)
      .subscribe((resp) => {
        console.log('buscar por ceduña' + JSON.stringify(resp));
      

        this.arrayRespuesta=resp;
       
      });
    setTimeout(() => {
      this.filtrar();
      setTimeout(() => {
        this.sumar();
      }, 900);
      this.spinner.hide();
    }, 900);
  }
  filtrar(){
    let aux: never[]=[];
   
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    console.log("anio actual"+anioActual)
    for (let i = 0; i < this.arrayRespuesta.length; i++) {
      if (this.arrayRespuesta[i]['anio'] <= anioActual) {
        aux.push(this.arrayRespuesta[i]);
      }
    }
    console.log("=========<"+ JSON.stringify(aux))
    this.arrayRespuesta=aux;
  }

  onSubmit() {}
  sumar() {
    let sumasr = this.arrayRespuesta.reduce((acumulador, objeto) => {
      return (
        acumulador +
        (objeto['emision'] +
          objeto['iva'] +
          objeto['recargo'] +
          objeto['vespecie'] +
          objeto['interes']+
          objeto['coactiva']-objeto["descuento"]
          )
      );
    }, 0);
    this.totalsinremision = sumasr;
    this.sumar2();
  }
  sumar2() {
    let sumacr = this.arrayRespuesta.reduce((acumulador, objeto) => {
      return (
        acumulador +
        (objeto['emision'] +
          objeto['iva'] +
          objeto['recargo'] +
          objeto['vespecie'] +
          objeto['coactiva']+
          objeto['interes'] -
          (objeto['reminteres'] + objeto['remmultas'] + objeto['remrecargo']+objeto["descuento"]))
      );
    }, 0);
    this.totalconremision = sumacr;
    this.sumarremisiones();
  }
  sumarremisiones() {
    let tremi = this.arrayRespuesta.reduce((acumulador, objeto) => {
      return (
        acumulador +
        (objeto['reminteres'] + objeto['remmultas'] + objeto['remrecargo'])
      );
    }, 0);
    this.totalremisiones = tremi;
  }
}
