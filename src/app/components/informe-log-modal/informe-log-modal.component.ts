import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

import { HistorialResponse, Backup } from '../../models/historial.model';
import { InformeService } from '../../services/informe.service';
import { AlertService } from '../../shared/alert.service';

/* ---- Estructuras para el árbol ---- */
interface NodeAttempt {
  numeroIntento: number;          // intento automático
  reintentoOfUsuario: number;     // reproceso manual
  fecha: string;
  statusCode: number;
  mensaje: string;
}

interface NodePhase {
  fase: string;
  attempts: NodeAttempt[];
  backups: Backup[];
}

@Component({
  selector: 'app-informe-log-modal',
  templateUrl: './informe-log-modal.component.html',
  styleUrls: ['./informe-log-modal.component.css']
})
export class InformeLogModalComponent implements OnInit {

  /** Datos agrupados para el árbol */
  agrupado: NodePhase[] = [];

  /** Para spinner */
  cargando = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public cfg: { informeId: number },
    private dialogRef: MatDialogRef<InformeLogModalComponent>,
    private informeSrv: InformeService,
    private alert: AlertService
  ) { }

  /* ================== ciclo ================== */
  ngOnInit(): void {
    this.informeSrv.getHistorial(this.cfg.informeId).subscribe({
      next: resp => {
        this.buildTree(resp);
        this.cargando = false;
      },
      error: () => {
        this.alert.error('No se pudo cargar el historial.');
        this.dialogRef.close();
      }
    });
  }

  /* agrupa logs + backups por fase */
  private buildTree(resp: HistorialResponse): void {

    const map = new Map<string, NodePhase>();

    /* agrupar logs */
    resp.logs.forEach(l => {
      if (!map.has(l.fase))
        map.set(l.fase, { fase: l.fase, attempts: [], backups: [] });
      map.get(l.fase)!.attempts.push({
        numeroIntento:       l.numeroIntento,
        reintentoOfUsuario:  l.reintentoOfUsuario,
        fecha:               l.fechaIntento,
        statusCode:          l.statusCode,
        mensaje:             l.mensaje
      });
    });

    /* agrupar backups */
    resp.backups.forEach(b => {
      if (!map.has(b.fase))
        map.set(b.fase, { fase: b.fase, attempts: [], backups: [] });
      map.get(b.fase)!.backups.push(b);
    });

    /* convertir a array ordenado alfabéticamente por fase */
    this.agrupado = Array.from(map.values())
                         .sort((a, b) => a.fase.localeCompare(b.fase));
  }

  /* ================ acciones UI ================ */
  close(): void { this.dialogRef.close(); }

  descargar(b: Backup): void {
    if (!b.descargable) return;

    this.informeSrv.downloadBackup(this.cfg.informeId, b.id)
      .subscribe({
        next: blob =>
          saveAs(
            blob,
            `backup_${b.fase}_${b.reintentoOfUsuario}_${b.numeroIntento}.txt`
          ),
        error: () => this.alert.error('Descarga fallida.')
      });
  }
}
