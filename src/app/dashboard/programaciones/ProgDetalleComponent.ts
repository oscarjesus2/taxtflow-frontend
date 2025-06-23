import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DashboardService, ProxProgDTO } from "src/app/services/dashboard.service";
import { EjecucionesDialogComponent } from "./EjecucionesDialogComponent";

@Component({
  selector:'app-prog-detalle',
  template:`
  <h2>Programación #{{ prog?.id }}</h2>
  <p>Cliente {{ prog?.clienteRuc }} | {{ prog?.tipoInforme }}</p>

  <button class="btn" (click)="abrirModal()">Ver ejecuciones</button>`
})
export class ProgDetalleComponent implements OnInit{
  prog?:ProxProgDTO;
  constructor(private route:ActivatedRoute,private api:DashboardService,private modal:NgbModal){}
  ngOnInit(){
    const id=this.route.snapshot.paramMap.get('id')!;
    this.api.getProgramacion(+id).subscribe(p=>this.prog=p);
  }
  abrirModal(){
    this.modal.open(EjecucionesDialogComponent,{size:'lg',centered:true})
        .componentInstance.programacionId=this.prog!.id;
  }
}
