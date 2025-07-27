import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoInforme, TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { InformeService } from 'src/app/services/informe.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-generar-informe',
  templateUrl: './generar-informe.component.html',
  styleUrls: ['./generar-informe.component.css']
})
export class GenerarInformeComponent implements OnInit {

  clientes: Cliente[] = [];
  tipoInformeDescripcion = TipoInformeDescripcion;
  tipoInformeKeys = Object.keys(TipoInforme) as TipoInforme[];

  clienteId: number = 0;
  anio: number = new Date().getFullYear();
  anios: number[] = [];
  meses: { valor: number, nombre: string }[] = [];
  mesesSeleccionados: number[] = [];
  tiposSeleccionados: string[] = [];

  constructor(
    private clienteService: ClienteService,
    private informeService: InformeService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.anios = Array.from({ length: 5 }, (_, i) => currentYear - i);
    this.actualizarMeses();

    this.clienteService.listarPropios().subscribe(data => {
      this.clientes = data;
    });
  }

  actualizarMeses(): void {
    const currentMonth = new Date().getMonth() + 1;
    const limite = this.anio === new Date().getFullYear() ? currentMonth : 12;
    this.meses = Array.from({ length: limite }, (_, i) => ({
      valor: i + 1,
      nombre: new Date(0, i).toLocaleString('es-ES', { month: 'long' })
    }));
    this.mesesSeleccionados = [];
  }

  toggleMes(valor: number): void {
    this.mesesSeleccionados.includes(valor)
      ? this.mesesSeleccionados = this.mesesSeleccionados.filter(m => m !== valor)
      : this.mesesSeleccionados.push(valor);
  }

  toggleTipo(valor: string): void {
    this.tiposSeleccionados.includes(valor)
      ? this.tiposSeleccionados = this.tiposSeleccionados.filter(t => t !== valor)
      : this.tiposSeleccionados.push(valor);
  }

  generar(): void {
    if (!this.clienteId || !this.anio || this.mesesSeleccionados.length === 0 || this.tiposSeleccionados.length === 0) {
      this.alert.error('Complete todos los campos obligatorios.');
      return;
    }

    const periodos = this.mesesSeleccionados.map(m => `${this.anio}${m.toString().padStart(2, '0')}`);
    const payload = {
      clienteId: Number(this.clienteId),
      periodos,
      tiposInforme: this.tiposSeleccionados
    };

    this.informeService.generarInformesMasivos(payload).subscribe({
      next: resumen => {
        this.alert.success(`Generados: ${resumen.generados.length}, Omitidos: ${resumen.omitidos.length}`);
        this.router.navigate(['/informes']);
      },
      error: err => {
        console.error(err);
        this.alert.error('Error al generar informes.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/informes']);
  }
}
