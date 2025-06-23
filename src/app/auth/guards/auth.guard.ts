import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { KeycloakService } from "../keycloak.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private keycloak: KeycloakService) {}

  canActivate(): boolean {
    if (this.keycloak.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
