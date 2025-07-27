import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { InformesManualesComponent } from './informes/informes-manuales/informes-manuales.component';
import { ProgramacionesComponent } from './informes/programaciones/programaciones.component';
import { ConfiguracionComponent } from './configuracion/configuracion/configuracion.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ProgramacionFormComponent } from './informes/programacion-form/programacion-form.component';
import { ProgDetalleComponent } from './dashboard/programaciones/ProgDetalleComponent';
import { GenerarInformeComponent } from './informes/generar-informe/generar-informe.component';
 
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'clientes', component: ClienteListComponent },
      { path: 'clientes/form', component: ClienteFormComponent },
      { path: 'clientes/form/:id', component: ClienteFormComponent },
      { path: 'informes', component: InformesManualesComponent },
      { path: 'informes/generar', component: GenerarInformeComponent },
      { path: 'programaciones', component: ProgramacionesComponent },
      { path: 'programaciones/form', component: ProgramacionFormComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
       {path: 'programaciones/:id',component:ProgDetalleComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
