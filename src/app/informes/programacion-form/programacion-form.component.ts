import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProgramacionInforme } from 'src/app/models/programacion-informe.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { TipoInforme, TipoInformeDescripcion } from 'src/app/enums/tipo-informe.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramacionService } from 'src/app/services/programacion.service';

@Component({
  selector: 'app-programacion-form',
  templateUrl: './programacion-form.component.html',
  styleUrls: ['./programacion-form.component.css']
})
export class ProgramacionFormComponent implements OnInit {

  programacion: ProgramacionInforme = this.nuevaProgramacion();
  clientes: Cliente[] = [];
  tipoInformeKeys = Object.keys(TipoInforme) as TipoInforme[];
  tipoInformeDescripcion = TipoInformeDescripcion;

  constructor(
    private route: ActivatedRoute,
    private programacionService: ProgramacionService,
    private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit(): void {

    /* Cargar clientes primero  */
    this.clienteService.listarPropios().subscribe(cs => {
      this.clientes = cs;

      /* Luego comprobar si es edición / copia */
      const idParam = this.route.snapshot.queryParamMap.get('id');
      const id = idParam ? parseInt(idParam, 10) : null;
      const copy = this.route.snapshot.queryParamMap.get('copy') === 'true';

      if (id) {
        this.programacionService.obtener(id).subscribe(p => {
          if (copy) {
            this.programacion = { ...p, id: 0, clienteRazonSocial: '', propietarioId: '', propietarioEmail: '' };
          } else {
            this.programacion = p; // ⚠️ Aquí se mantiene el id original
          }
        });
      }
    });
  }


  private nuevaProgramacion(): ProgramacionInforme {
    return {
      id: 0,
      clienteId: 0,
      clienteRazonSocial: '',
      propietarioId: '',
      propietarioEmail: '',
      tipoInforme: TipoInforme.REGISTRO_VENTAS,
      fechaInicio: '',
      horaEjecucion: '',
      frecuencia: '',
      activo: true,
      destino: 'FTP',
      urlDestino: '',
      nombreArchivo: '',
      formato: 'PDF',
      fechaProximaEjecucion: ''
    };
  }

  onSubmit(): void {
    const op = this.programacion.id
      ? this.programacionService.actualizar(this.programacion)
      : this.programacionService.crear(this.programacion);

    op.subscribe(() => this.router.navigate(['/programaciones']));
  }

  onCancel(): void {
    this.router.navigate(['/programaciones']);
  }
}
