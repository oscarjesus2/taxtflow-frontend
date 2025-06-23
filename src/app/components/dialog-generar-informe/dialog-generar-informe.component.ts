import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TipoInforme, TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-dialog-generar-informe',
  templateUrl: './dialog-generar-informe.component.html',
  styleUrls: ['./dialog-generar-informe.component.css']
})
export class DialogGenerarInformeComponent implements OnInit {



  tipoInformeDescripcion = TipoInformeDescripcion;
  tipoInformeKeys = Object.keys(TipoInforme) as TipoInforme[];

  clienteId: number = 0;
  tipoInforme: string = '';
  clientes: Cliente[] = [];
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;
  anios: number[] = [];
  meses = [
    { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
  ];


  constructor(
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<DialogGenerarInformeComponent>
  ) {}

  ngOnInit(): void {
    this.clienteService.listarPropios().subscribe(clientes => this.clientes = clientes);
    const currentYear = new Date().getFullYear();
    this.anios = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  generar(): void {
    if (this.clienteId && this.tipoInforme && this.anio && this.mes) {
      this.dialogRef.close({
        clienteId: this.clienteId,
        tipoInforme: this.tipoInforme,
        periodo: `${this.anio}${this.mes.toString().padStart(2, '0')}`
      });
    }
  }
  cancelar(): void {
    this.dialogRef.close();
  }
}