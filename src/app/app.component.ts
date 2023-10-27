import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  titulo = 'electric-company';
  COSTO_RECIDENCIAL = 2.25;
  COSTO_COMERCIAL = 4.5;
  listaClientes: any;
  listaProcesada: Cliente[] = [];

  fromList!: FormGroup;
  formSearch!: FormGroup;
  checkOrdenAlfabetico: boolean = false;
  checkDeudores: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.fromList = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      tipoDomicilio: ['', Validators.required],
      consumo: [0, Validators.required],
      deuda: [0, Validators.required]
    });
    this.formSearch = this.formBuilder.group({
      buscarControls: [''],
    });
   }

  ngOnInit() {

    this.listaClientes = [
      ['Anthony', 'Aguilar', '95123456', 'residencial', 2000.10, 0], //DescuentoR 10%
      ['Federico', 'Barrios', '95789456', 'comercial', 7000, 0], // DescuentoC 10%
      ['Carlos', 'Soublete', '95123101', 'residencial', 5000.30, 0], // DescuentoR 15%
      ['Andres', 'Gonzales', '95121456', 'residencial', 2500, 1000],
      ['Alexis', 'Zanches', '95123314', 'residencial', 5600.30, 4500.25],
      ['Sebastian', 'Santillan', '95151456', 'comercial', 150.10, 0.22],
      ['German', 'Kractzer', '95123617', 'comercial', 7002, 0], // DescuentoC 15%
      ['Matias', 'Deoz', '95181456', 'comercial', 5001, 0], // DescuentoC 10%
      ['Nahuel', 'Lopez', '95123192', 'residencial', 5000, 400],
      ['Franco', 'Torres', '95202456', 'comercial', 9000, 2000],
    ]

    this.procesarLista(this.listaClientes);
  }

  procesarLista(clientes: any) {

    this.listaProcesada = [];

    clientes.map((item: any) => {
      let cliente: Cliente = {
        nombre: item[0],
        apellido: item[1],
        dni: item[2],
        tipoDomicilio: item[3],
        consumo: this.getCostoConsumo(item[3], item[4]),
        deuda: item[5],
        descuento: (item[5] === 0) ? this.getDescuento(item) : 0
      }
      cliente.montoAPagar = this.getMontoAPagar(cliente);
      this.listaProcesada.push(cliente);
    })
  }

  getCostoConsumo(tipoDomicilio: string, consumoKW: number ) {
    let consumo = 0;
    if (tipoDomicilio === 'comercial') {
      consumo = consumoKW * this.COSTO_COMERCIAL;
    } else {
      consumo = consumoKW * this.COSTO_RECIDENCIAL;
    }
    return parseFloat(consumo.toFixed(2));
  }

  getDescuento(item: any) {

    if (item[3] === 'residencial') {
      if (item[4] > 2000 && item[4] <= 5000) {
        return 10; // % de descuento
      } else if (item[4] > 5000) {
        return 15; // % de descuento
      }
    } else if (item[3] === 'comercial') {
      if (item[4] > 5000 && item[4] <= 7000) {
        return 10; // % de descuento
      } else if (item[4] > 7000) {
        return 15; // % de descuento
      }
    }

    return 0
  }

  getMontoAPagar(cliente: Cliente) {

    let montoAPagar: number = 0;
   if (cliente.descuento != 0) {
    montoAPagar =  cliente.consumo * (cliente.descuento / 100);
   } 
   montoAPagar = cliente.consumo + cliente.deuda;
   return parseFloat(montoAPagar.toFixed(2));
  }

  deleteItem(dni: string) {
    this.listaClientes = this.listaClientes.filter((client: string) => client[2] !== dni)
    this.procesarLista(this.listaClientes);
    alert('Cliente eliminado con exito!') 
  }

  search() {
    let nombreCliente = this.formSearch.controls['buscarControls'].value;
    this.listaProcesada = this.listaProcesada.filter(client => client.nombre == nombreCliente)
  }

  onCheckboxChange() {
    if (this.checkOrdenAlfabetico == true) {
      this.listaProcesada.sort((a,b) => {
        const nombreA = a.nombre.toUpperCase();
        const nombreB = b.nombre.toUpperCase();

        if (nombreA < nombreB) {
          return -1
        }
        if (nombreA > nombreB) {
          return 1;
        }
        return 0
      })
    } else {
      this.resetList();
    }
  }

  onCheckboxChangeDeudores() {
    if (this.checkDeudores) {
      this.listaProcesada = this.listaProcesada.
      filter(client => client.deuda !== 0)
    } else {
      this.resetList();
    }
  }

  resetList() {
    this.checkDeudores = false;
    this.checkOrdenAlfabetico = false;
    this.formSearch.reset();
    this.procesarLista(this.listaClientes);
  }

  onSubmit() {
    let formData  = this.fromList.controls;
    let cliente = [
      formData['nombre'].value, 
      formData['apellido'].value, 
      formData['dni'].value, 
      formData['tipoDomicilio'].value, 
      formData['consumo'].value, 
      formData['deuda'].value
    ]
    this.listaClientes.push(cliente)
    this.procesarLista(this.listaClientes);

  }

}

export interface Cliente {
  nombre: string,
  apellido: string,
  dni: string,
  tipoDomicilio: string,
  consumo: number,
  deuda: number,
  descuento: number,
  montoAPagar?: number
}