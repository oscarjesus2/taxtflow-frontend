import { Component, OnInit } from '@angular/core';
import { ProgramacionInforme } from 'src/app/models/programacion-informe.model';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { AlertService } from 'src/app/shared/alert.service';
import { Cliente } from 'src/app/models/cliente.model';
import { TipoInforme } from 'src/app/enums/tipo-informe.enum';
import { MatDialog } from '@angular/material/dialog';
import { ProgramacionFormComponent } from '../programacion-form/programacion-form.component';
import { Router } from '@angular/router';

interface Filtros {
  clienteId: number | null;
  tipos: string[];
  fechaEjecucion: string | null;
  soloActivos: boolean;
}

@Component({
  selector: 'app-programaciones',
  templateUrl: './programaciones.component.html',
  styleUrls: ['./programaciones.component.css']
})
export class ProgramacionesComponent implements OnInit {

  /** tabla */
  programaciones: ProgramacionInforme[] = [];
  loading = false;

  /** filtros */
  clientes: Cliente[] = [];
  tipos = Object.keys(TipoInforme) as TipoInforme[];
  filtro: Filtros = { clienteId: null, tipos: [], fechaEjecucion: null, soloActivos: false };

  /** paginación */
  pageRows: ProgramacionInforme[] = [];
  paginaActual = 1;
  readonly filasPorPagina = 10;
  totalPaginas = 1;

  /** formulario */
  mostrarFormulario = false;
  programacionSeleccionada: ProgramacionInforme | null = null;

  constructor(
    private programacionSrv: ProgramacionService,
    private clienteService: ClienteService,
       private router: Router,
    private alert: AlertService,
        private dialog: MatDialog,
  ) { }

    /* ---------- botones ---------- */
  /** Nuevo */
  nuevo(): void {
    this.router.navigate(['/programaciones/form']);
  }

  /** Editar */
  editar(p: ProgramacionInforme): void {
    this.router.navigate(['/programaciones/form'], { queryParams: { id: p.id , copy: false} });
  }

  /** Duplicar (opcional) → abre form con ?id=…&copy=true */
  duplicar(p: ProgramacionInforme): void {
    this.router.navigate(
      ['/programaciones/form'],
      { queryParams: { id: p.id, copy: true } }
    );
  }
  ngOnInit(): void {
    this.cargarClientes();
    this.cargarTodas();
  }

  /* ----------------------------- datos ----------------------------- */

  cargarClientes(): void {
    this.clienteService.listarPropios().subscribe(cs => (this.clientes = cs));
  }

  cargarTodas(): void {
    this.loading = true;
    this.programacionSrv.listarTodas().subscribe({
      next: data => {
        this.programaciones = data;
        this.aplicarFiltros();      // → rellena pageRows
        this.loading = false;
      },
      error: () => {
        this.alert.error('Error al cargar programaciones');
        this.loading = false;
      }
    });
  }

  /* ----------------------------- filtros --------------------------- */

  aplicarFiltros(): void {
    let rows = [...this.programaciones];

    // cliente
    if (this.filtro.clienteId) {
      rows = rows.filter(r => r.clienteId === this.filtro.clienteId);
    }
    // tipos
    if (this.filtro.tipos.length) {
      rows = rows.filter(r => this.filtro.tipos.includes(r.tipoInforme));
    }
    // próxima ejecución exacta
    if (this.filtro.fechaEjecucion) {
      const f = this.filtro.fechaEjecucion;           // string garantizado
      rows = rows.filter(r =>
        r.fechaProximaEjecucion !== null &&           // descarta null
        r.fechaProximaEjecucion.startsWith(f)         // compara
      );
    }

    // activo / inactivo
    if (this.filtro.soloActivos) {
      rows = rows.filter(r => r.activo);
    }

    this.paginaActual = 1;
    this.pagear(rows);
  }

  resetFiltros(): void {
    this.filtro = { clienteId: null, tipos: [], fechaEjecucion: null, soloActivos: false };
    this.aplicarFiltros();
  }

  /* ----------------------------- orden ----------------------------- */

  ordenCol = '';
  desc = false;

  ordenarPor(col: string): void {
    if (this.ordenCol === col) { this.desc = !this.desc; }
    else { this.ordenCol = col; this.desc = false; }

    const factor = this.desc ? -1 : 1;
    const rows = [...this.obtenerRowsFiltrados()].sort((a: any, b: any) => {
      const x = (col === 'cliente') ? a.cliente.razonSocial : a[col];
      const y = (col === 'cliente') ? b.cliente.razonSocial : b[col];
      return x > y ? factor : x < y ? -factor : 0;
    });

    this.pagear(rows);
  }

  /* ----------------------------- paginación ------------------------ */

  cambiarPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas) return;
    this.paginaActual = n;
    this.pagear(this.obtenerRowsFiltrados());
  }

  private pagear(rows: ProgramacionInforme[]): void {
    this.totalPaginas = Math.max(1, Math.ceil(rows.length / this.filasPorPagina));
    const ini = (this.paginaActual - 1) * this.filasPorPagina;
    this.pageRows = rows.slice(ini, ini + this.filasPorPagina);
  }

  private obtenerRowsFiltrados(): ProgramacionInforme[] {
    // reaplica filtros sobre el dataset completo para orden/paginación
    let rows = [...this.programaciones];
    const f = this.filtro;
    if (f.clienteId) rows = rows.filter(r => r.clienteId === f.clienteId);
    if (f.tipos.length) rows = rows.filter(r => f.tipos.includes(r.tipoInforme));
    if (f.fechaEjecucion) {
      const fecha = f.fechaEjecucion;              //  ←  ahora es string

      rows = rows.filter(
        r => r.fechaProximaEjecucion !== null &&
          r.fechaProximaEjecucion.startsWith(fecha)
      );
    }

    if (f.soloActivos) rows = rows.filter(r => r.activo);
    return rows;
  }

  /* ----------------------------- acciones fila --------------------- */

  
  cerrarFormulario(): void { this.mostrarFormulario = false; this.programacionSeleccionada = null; }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar definitivamente?')) return;
    this.programacionSrv.eliminar(id).subscribe({
      next: () => { this.alert.success('Programación eliminada'); this.cargarTodas(); },
      error: () => this.alert.error('Error al eliminar')
    });
  }

  guardarProgramacion(p: ProgramacionInforme): void {
    this.programacionSrv.crear(p).subscribe({
      next: () => { this.alert.success('Programación guardada'); this.cargarTodas(); },
      error: () => this.alert.error('Error al guardar')
    });
  }
}
