import { Component, OnInit } from '@angular/core';
import { DashboardService, InformeResumen, ProxProgDTO } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  resumen:any = {};
  informes: InformeResumen[] = [];
  proximas: ProxProgDTO[] = [];
  notificaciones: string[] = [];

  /* gráfica */
  lineLabels:string[] = [];
  lineData:any[] = [];

  constructor(private api: DashboardService) {}

  ngOnInit() {
    this.api.getResumen()
      .subscribe(r => this.resumen = r);

    this.api.getUltimosInformes()
      .subscribe(list => this.informes = list);

    this.api.getProximasProgramaciones()
      .subscribe(list => this.proximas = list);

    this.api.getTrend7d()
      .subscribe(chart => {
        this.lineLabels = chart.dias;
        this.lineData = [{ data: chart.valores, label: 'Informes' }];
      });

    this.api.getAlerts()
      .subscribe(arr => this.notificaciones = arr);
  }
}
