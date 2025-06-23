import { Component, Input, OnInit } from "@angular/core";
import { DashboardService } from "src/app/services/dashboard.service";

@Component({
 selector:'app-ejecuciones-dialog',
 template:`
 <div class="modal-header"><h4>Histórico de informes</h4></div>
 <div class="modal-body">
   <table>
     <thead><tr><th>Instante</th><th>Estado</th><th>Intentos</th><th></th></tr></thead>
     <tbody>
       <tr *ngFor="let e of ejecuciones">
         <td>{{ e.instante | date:'short' }}</td>
         <td>{{ e.estado }}</td>
         <td>{{ e.intentos }}</td>
         <td><a *ngIf="e.informeId" [routerLink]="['/informes',e.informeId]">🔎</a></td>
       </tr>
     </tbody>
   </table>
 </div>`
})
export class EjecucionesDialogComponent implements OnInit{
 @Input() programacionId!:number;
 ejecuciones:any[]=[];
 constructor(private api:DashboardService){}
 ngOnInit(){this.api.getRuns(this.programacionId).subscribe(e=>this.ejecuciones=e);}
}
