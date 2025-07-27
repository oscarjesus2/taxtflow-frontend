import { Injectable, OnDestroy } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import * as SockJS from 'sockjs-client';

import { environment } from 'src/environments/environment';
import { KeycloakService } from '../auth/keycloak.service';
import { InformeGenerado } from '../models/informe-generado.model';

@Injectable({ providedIn: 'root' })
export class InformeSocketService implements OnDestroy {

  private readonly stomp: RxStomp;

  constructor(private keycloak: KeycloakService) {
    /* 1. Instancia vacía */
    this.stomp = new RxStomp();

    /* 2. Configuración */
    const cfg: RxStompConfig = {
      // Usaremos SockJS (mejor compatibilidad). Sincroniza con tu back:
      webSocketFactory: () => new SockJS(`${environment.apiBaseUrl}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${this.keycloak.getToken()}`
      },

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 4000,
      debug: () => {}               // silenciar logs (usa console.log si necesitas)
    };

    /* 3. Arrancar el cliente */
    this.stomp.configure(cfg);
    this.stomp.activate();
  }

  /**
   * Observable que emite cada vez que llega un mensaje del backend
   * para el propietario/tenant indicado.
   */
  informes$(tenantId: number): Observable<InformeGenerado> {
    return this.stomp
      .watch(`/topic/tenant.${tenantId}`)
      .pipe(map(f => JSON.parse(f.body) as InformeGenerado));
  }

  ngOnDestroy(): void {
    this.stomp.deactivate();
  }
}
