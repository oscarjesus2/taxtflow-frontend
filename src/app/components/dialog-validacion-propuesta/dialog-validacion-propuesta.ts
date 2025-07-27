import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Fase } from 'src/app/enums/fase.enum';
import { InformeService } from 'src/app/services/informe.service';
import { ValidacionInformeService } from 'src/app/services/validacion-informe.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-dialog-validacion-propuesta',
  templateUrl: './dialog-validacion-propuesta.html',
  styleUrls: ['./dialog-validacion-propuesta.css']
})
export class DialogValidacionPropuestaComponent {

 archivoSeleccionado: File | null = null;
  isCargando = false;
  resumen: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idInforme: number; tipo: 'ventas' | 'compras' },
    private dialogRef: MatDialogRef<DialogValidacionPropuestaComponent>,
    private informeService: InformeService,
    private validacionService: ValidacionInformeService,
    private alertService: AlertService
  ) {}

  seleccionarArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0] ?? null;
  }

  enviarArchivo() {
    if (!this.archivoSeleccionado) {
      this.alertService.info('Selecciona un archivo Excel válido');
      return;
    }

    this.isCargando = true;

  this.validacionService.validarExcel(this.data.idInforme, this.data.tipo, Fase.PROPUESTA, this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.resumen = res;
        this.isCargando = false;
      },
      error: () => {
        this.alertService.error('No se pudo validar el archivo');
        this.isCargando = false;
      }
    });
  }

  descargarResultado() {
    this.validacionService.descargarResultado(this.data.idInforme, 'ventas', Fase.PROPUESTA)
  .subscribe(blob => {
      const nombreArchivo = `Validacion_${this.data.tipo}_${this.data.idInforme}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      link.click();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}