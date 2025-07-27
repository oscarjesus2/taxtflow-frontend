import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';      // 🔸 from
import { switchMap, catchError } from 'rxjs/operators';   // 🔸 switchMap
import { KeycloakService } from './keycloak.service';
import { AlertService } from '../shared/alert.service';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  private alreadyRedirected = false;

  constructor(
    private keycloakService: KeycloakService,
    private alertService: AlertService
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 🔸 1) Pedimos a Keycloak que refresque si el access-token caduca en <30 s
    return from(this.keycloakService.updateToken(30)).pipe(
      // 🔸 2) Cuando la promesa resuelve (true/false), continuamos la request
      switchMap(() => {
        const token = this.keycloakService.getToken();

        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;

        return next.handle(authReq);
      }),

      // 🔸 3) Gestionamos 401 y otros errores
      catchError((error: HttpErrorResponse) => {
        const codigo = error?.error?.codigo || '';
        const mensaje = error?.error?.mensaje || error?.message || 'Error inesperado del servidor';

        if (error.status === 401 && !this.alreadyRedirected) {
          this.alreadyRedirected = true;
          this.keycloakService.logout();
        } else if (error.status === 400) {
          this.alertService.validacion(mensaje);
        } else if (error.status === 403) {
          this.alertService.info(mensaje);
        } else {
          this.alertService.error(mensaje);
        }

        return throwError(() => error);
      })

    );
  }
}
