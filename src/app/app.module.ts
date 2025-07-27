import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { TokenInterceptor } from './auth/token.interceptor';
import { KeycloakService } from './auth/keycloak.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ConfiguracionComponent } from './configuracion/configuracion/configuracion.component';
import { InformesManualesComponent } from './informes/informes-manuales/informes-manuales.component';
import { InformeCardComponent } from './informes/informe-card/informe-card.component';
import { ProgramacionesComponent } from './informes/programaciones/programaciones.component';
import { ProgramacionFormComponent } from './informes/programacion-form/programacion-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EjecucionesDialogComponent } from './dashboard/programaciones/EjecucionesDialogComponent';
import { ProgDetalleComponent } from './dashboard/programaciones/ProgDetalleComponent';
import { NgChartsModule } from 'ng2-charts';
import { GenerarInformeComponent } from './informes/generar-informe/generar-informe.component';
import { InformeLogModalComponent } from './components/informe-log-modal/informe-log-modal.component';
import { DialogValidacionPropuestaComponent } from './components/dialog-validacion-propuesta/dialog-validacion-propuesta';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () => keycloak.init();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LayoutComponent,
    SidebarComponent,
    TopbarComponent,
    ClienteListComponent,
    ClienteFormComponent,
    InformesManualesComponent,
    ConfiguracionComponent,
    InformeCardComponent,
    ProgramacionesComponent,
    ProgramacionFormComponent,
    GenerarInformeComponent,
    EjecucionesDialogComponent,
    ProgDetalleComponent,
    InformeLogModalComponent,
    DialogValidacionPropuestaComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AuthModule,
    NoopAnimationsModule,
    MatDialogModule,
    SharedModule,
    NgbModule,
    NgChartsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
