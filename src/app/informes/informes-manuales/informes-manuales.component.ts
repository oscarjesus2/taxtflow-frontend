
import { interval, Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { InformeGenerado } from 'src/app/models/informe-generado.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { InformeService } from 'src/app/services/informe.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenerarInformeComponent } from 'src/app/components/dialog-generar-informe/dialog-generar-informe.component';
import { TipoInforme, TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { AlertService } from 'src/app/shared/alert.service'

@Component({
  selector: 'app-informes-manuales',
  templateUrl: './informes-manuales.component.html',
  styleUrls: ['./informes-manuales.component.css']
})
export class InformesManualesComponent implements OnInit {
  private pollingSub!: Subscription;
  tipoInformeDescripcion = TipoInformeDescripcion;
  tipoInformeKeys = Object.keys(TipoInforme) as TipoInforme[];
  filtroAnio: string = '';
  anios: number[] = [];
  filtroMes: string = '';
  meses = [
    { valor: '01', nombre: 'Enero' },
    { valor: '02', nombre: 'Febrero' },
    { valor: '03', nombre: 'Marzo' },
    { valor: '04', nombre: 'Abril' },
    { valor: '05', nombre: 'Mayo' },
    { valor: '06', nombre: 'Junio' },
    { valor: '07', nombre: 'Julio' },
    { valor: '08', nombre: 'Agosto' },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' },
    { valor: '12', nombre: 'Diciembre' },
  ];

  informes: InformeGenerado[] = [];
  informesFiltrados: InformeGenerado[] = [];
  clientes: Cliente[] = [];

  filtroClienteId: string = '';
  filtroTipo: string = '';

  constructor(
    private informeService: InformeService,
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.iniciarPollingCondicional();
  }

  ngOnDestroy(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }
  private cargarDatosIniciales(): void {
      this.refrescarLista();

    const currentYear = new Date().getFullYear();
    this.anios = Array.from({ length: 5 }, (_, i) => currentYear - i);

    this.clienteService.listarPropios().subscribe(data => {
      this.clientes = data;
    });
  }
  private iniciarPollingCondicional(): void {
  this.pollingSub = interval(5000)
    .subscribe(() => this.refrescarLista());
}


  filtrarInformes(): void {
    this.informesFiltrados = this.informes
      .filter(inf =>
        (!this.filtroClienteId || inf.cliente.id == +this.filtroClienteId) &&
        (!this.filtroTipo || inf.tipoInforme === this.filtroTipo) &&
        (!this.filtroAnio || inf.periodo?.startsWith(this.filtroAnio)) &&
        (!this.filtroMes || inf.periodo?.substring(4, 6) === this.filtroMes)
      )
      .sort((a, b) => Number(b.periodo) - Number(a.periodo)); // ← Ordena por periodo descendente
  }

  abrirDialogoGenerar(): void {
    const dialogRef = this.dialog.open(DialogGenerarInformeComponent, {
      width: '700px',
      panelClass: 'centrado-dialogo'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { clienteId, tipoInforme, periodo } = result;
        this.informeService.generarInforme(clienteId, tipoInforme, periodo).subscribe(() => {
          this.informeService.listarTodos().subscribe(data => {
            this.informes = data;
            this.filtrarInformes();
          });
        });
      }
    });
  }

  eliminarInforme(id: number): void {
    this.informeService.eliminarInforme(id).subscribe({
      next: () => {
        this.informes = this.informes.filter(i => i.id !== id);
        this.filtrarInformes();
        this.alert.success('Informe eliminado correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.alert.error('No se pudo eliminar el informe.');
      }
    });
  }

  isRefrescando: boolean = false;

  refrescarLista(): void {
    this.isRefrescando = true;
    this.informeService.listarTodos().subscribe({
      next: (data) => {
        this.informes = data;
        this.filtrarInformes();
        this.isRefrescando = false;
      },
      error: (err) => {
        console.error('Error al refrescar:', err);
        this.isRefrescando = false;
      }
    });
  }
}