
import { interval, Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { InformeGenerado } from 'src/app/models/informe-generado.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { InformeService } from 'src/app/services/informe.service';
import { MatDialog } from '@angular/material/dialog';
import { TipoInforme, TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { AlertService } from 'src/app/shared/alert.service'
import { Router } from '@angular/router';
import { InformeSocketService } from 'src/app/services/informe-socket.service';
import { KeycloakService } from 'src/app/auth/keycloak.service';

@Component({
  selector: 'app-informes-manuales',
  templateUrl: './informes-manuales.component.html',
  styleUrls: ['./informes-manuales.component.css']
})
export class InformesManualesComponent implements OnInit {
 
  private socketSub!: Subscription;

  /* ---------- filtros y catálogos ---------- */
  tipoInformeDescripcion = TipoInformeDescripcion;
  readonly tipoInformeKeys = Object.values(TipoInforme) as TipoInforme[];

  filtroClienteId = '';
  filtroTipo      = '';
  filtroAnio      = '';
  filtroMes       = '';

  anios: number[] = [];
  meses = [
    { valor: '01', nombre: 'Enero' },   { valor: '02', nombre: 'Febrero' },
    { valor: '03', nombre: 'Marzo' },   { valor: '04', nombre: 'Abril'   },
    { valor: '05', nombre: 'Mayo'  },   { valor: '06', nombre: 'Junio'   },
    { valor: '07', nombre: 'Julio' },   { valor: '08', nombre: 'Agosto'  },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' },
    { valor: '12', nombre: 'Diciembre' },
  ];

  /* ---------- datos ---------- */
  informes:           InformeGenerado[] = [];
  informesFiltrados:  InformeGenerado[] = [];
  clientes:           Cliente[]         = [];

  groupedInformes: {
    tipo:        TipoInforme;
    descripcion: string;
    informes:    InformeGenerado[];
  }[] = [];

  /* ---------- control ---------- */
  isRefrescando = false;
  private pollingSub!: Subscription;

  constructor(
    private informeSocket: InformeSocketService,
    private keycloak       : KeycloakService,
    private informeService: InformeService,
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();

    /* id del propietario/tenant ⇒ puedes sustituir por otro claim si lo prefieres */
    const tenantId = +(this.keycloak.getUsername() || 0);

    this.socketSub = this.informeSocket
      .informes$(tenantId)
      .subscribe(inf => this.merge(inf));
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
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

  private merge(update: InformeGenerado): void {
    const idx = this.informes.findIndex(i => i.id === update.id);

    if (idx !== -1) {
      this.informes[idx] = { ...this.informes[idx], ...update };  // patch
    } else {
      this.informes.push(update);                                 // alta nueva
    }
    this.filtrarInformes();                                       // refresca UI
  }
  
  filtrarInformes(): void {
    this.informesFiltrados = this.informes
      .filter(inf =>
        (!this.filtroClienteId || inf.cliente.id == +this.filtroClienteId) &&
        (!this.filtroTipo || inf.tipoInforme === this.filtroTipo) &&
        (!this.filtroAnio || inf.periodo?.startsWith(this.filtroAnio)) &&
        (!this.filtroMes || inf.periodo?.substring(4, 6) === this.filtroMes)
      )
      .sort((a, b) => Number(b.periodo) - Number(a.periodo));

    /** Construir los grupos por tipo */
    const map = new Map<TipoInforme, InformeGenerado[]>();
    for (const inf of this.informesFiltrados) {
      const tipo = inf.tipoInforme as TipoInforme;   // ← ① cast rápido

      if (!map.has(tipo)) map.set(tipo, []);
      map.get(tipo)!.push(inf);
    }


    this.groupedInformes = Array.from(map.entries()).map(
      ([tipo, informes]) => ({
        tipo,
        descripcion: this.tipoInformeDescripcion[tipo],
        informes
      })
    );
  }

  nuevo(): void {
    this.router.navigate(['/informes/generar']);
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