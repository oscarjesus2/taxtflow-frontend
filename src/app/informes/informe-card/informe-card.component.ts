import { Component, Input, Output, EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver';
import { TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { InformeGenerado } from 'src/app/models/informe-generado.model';
import { InformeService } from 'src/app/services/informe.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-informe-card',
  templateUrl: './informe-card.component.html',
  styleUrls: ['./informe-card.component.css']
})
export class InformeCardComponent {

  @Input() informe!: InformeGenerado;
  @Output() eliminar = new EventEmitter<number>();
  @Output() reintentar = new EventEmitter<void>();

  tipoInformeDescripcion = TipoInformeDescripcion;
  isDescargandoFase: string | null = null;

  constructor(private informeService: InformeService, private alertService: AlertService) { }

  getPeriodoLegible(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getDescripcionTipo(tipo: string): string {
    return Object.prototype.hasOwnProperty.call(this.tipoInformeDescripcion, tipo)
      ? this.tipoInformeDescripcion[tipo as keyof typeof this.tipoInformeDescripcion]
      : tipo;
  }


  eliminarInforme() {
    this.alertService.confirmEliminar('¿Eliminar informe?', 'Esta acción no se puede deshacer.')
      .then(confirmado => {
        if (!confirmado) return;

        this.eliminar.emit(this.informe.id);
      });

  }


  fasesDisponibles(): { clave: string, nombre: string }[] {
    const fases = [];

    if (this.informe.statusCodeRegistrado === 200)
      fases.push({ clave: 'REGISTRADO', nombre: 'Registrado' });

    if (this.informe.statusCodePreliminar === 200)
      fases.push({ clave: 'PRELIMINAR', nombre: 'Preliminar' });

    if (this.informe.statusCodePropuesta === 200)
      fases.push({ clave: 'PROPUESTA', nombre: 'Propuesta' });

    if (this.informe.statusCodeResumen === 200)
      fases.push({ clave: 'RESUMEN', nombre: 'Resumen' });

    return fases;
  }

  fasesCompletadas(): { clave: string, nombre: string }[] {
    return [
      { clave: 'REGISTRADO', nombre: 'Registrado', code: this.informe.statusCodeRegistrado },
      { clave: 'PRELIMINAR', nombre: 'Preliminar', code: this.informe.statusCodePreliminar },
      { clave: 'PROPUESTA', nombre: 'Propuesta', code: this.informe.statusCodePropuesta },
      { clave: 'RESUMEN', nombre: 'Resumen', code: this.informe.statusCodeResumen }
    ].filter(f => f.code === 200);
  }

  fasesPendientes(): { nombre: string, icon: string }[] {
    return [
      this.informe.statusCodeRegistrado !== 200 ? { nombre: 'Registrado', icon: 'fas fa-file-alt' } : null,
      this.informe.statusCodePreliminar !== 200 ? { nombre: 'Preliminar', icon: 'fas fa-clipboard-list' } : null,
      this.informe.statusCodePropuesta !== 200 ? { nombre: 'Propuesta', icon: 'fas fa-file-signature' } : null,
      this.informe.statusCodeResumen !== 200 ? { nombre: 'Resumen', icon: 'fas fa-chart-pie' } : null,
    ].filter(Boolean) as any[];
  }
  eliminarFase(fase: string, event: MouseEvent) {
    event.stopPropagation(); // evita que se dispare el click del botón principal

    this.alertService.confirmEliminar(
      `¿Eliminar fase ${fase}?`,
      'Esta acción eliminará permanentemente el archivo generado para esta fase.'
    ).then(confirmado => {
      if (!confirmado) return;

      this.informeService.eliminarFase(this.informe.id, fase).subscribe({
        next: () => {
          this.alertService.success(`Fase ${fase} eliminada correctamente.`);
          switch (fase) {
            case 'REGISTRADO': this.informe.statusCodeRegistrado = 0; break;
            case 'PRELIMINAR': this.informe.statusCodePreliminar = 0; break;
            case 'PROPUESTA': this.informe.statusCodePropuesta = 0; break;
            case 'RESUMEN': this.informe.statusCodeResumen = 0; break;
          }
        },
        error: () => {
          this.alertService.error(`No se pudo eliminar la fase ${fase}.`);
        }
      });
    });
  }


  descargarFase(fase: string) {
  this.isDescargandoFase = fase;

  switch (fase) {
    case 'REGISTRADO':
      this.informe.urlDescargaStreaming = this.informe.urlDescargaRegistrado ?? '';
      break;
    case 'PRELIMINAR':
      this.informe.urlDescargaStreaming = this.informe.urlDescargaPreliminar ?? '';
      break;
    case 'PROPUESTA':
      this.informe.urlDescargaStreaming = this.informe.urlDescargaPropuesta ?? '';
      break;
    case 'RESUMEN':
      this.informe.urlDescargaStreaming = this.informe.urlDescargaResumen ?? '';
      break;
    default:
      alert('Fase no válida para descarga.');
      this.isDescargandoFase = null;
      return;
  }

  const url = this.informe.urlDescargaStreaming.replace('{}', this.informe.id.toString());

  this.informeService.descargarInforme(url).subscribe({
    next: (blob) => {
      if (!blob || blob.size < 3400) {
        this.alertService.info('El informe no contiene registros para esta fase.');
        this.isDescargandoFase = null;
        return;
      }

      const nombre = `${this.informe.periodo}_${this.informe.tipoInforme}_${fase}.xlsx`;
      saveAs(blob, nombre);
      this.isDescargandoFase = null;
    },
    error: () => {
      this.alertService.error('No se pudo descargar el informe.');
      this.isDescargandoFase = null;
    }
  });
}


  reintentarInforme() {
    this.alertService.confirm(
      '¿Reintentar procesamiento?',
      'Se reiniciarán los reintentos y se volverá a procesar todas las fases.'
    ).then(confirmado => {
      if (!confirmado) return;

      this.informeService.reintentarInforme(this.informe.id).subscribe({
        next: () => {
          this.informe.estado = 'EN_PROCESO';
          this.informe.reintentosRegistrado = 0;
          this.reintentar.emit();
        },
        error: () => {
          this.alertService.error('No se pudo reiniciar el informe.');
        }
      });
    });
  }


  getPeriodoLegibleDesdePeriodo(periodo: string): string {
    if (!periodo || periodo.length !== 6) return '';
    const anio = periodo.substring(0, 4);
    const mes = parseInt(periodo.substring(4, 6));
    const nombreMes = new Date(0, mes - 1).toLocaleString('es-ES', {
      month: 'long'
    });
    // Capitaliza la primera letra del mes
    return `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${anio}`;
  }
  estadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'EN_PROCESO': return 'estado-en-proceso';
      case 'FINALIZADO': return 'estado-finalizado';
      case 'ERROR': return 'estado-error';
      default: return '';
    }
  }

  claseAnimacionPorEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'animacion-pendiente';
      case 'EN_PROCESO':
        return 'animacion-en-proceso';
      case 'ERROR':
        return 'animacion-error';
      case 'FINALIZADO':
      default:
        return ''; // sin animación
    }
  }


  colorClasePorTipo(tipo: string): string {
    switch (tipo?.toUpperCase()) {
      case 'REGISTRO_VENTAS': return 'ventas';
      case 'REGISTRO_COMPRAS': return 'compras';
      default: return '';
    }
  }
}
