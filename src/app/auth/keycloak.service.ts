import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance, KeycloakProfile } from 'keycloak-js';
import { UsuarioService } from '../services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak!: KeycloakInstance;

  constructor(private usuarioService: UsuarioService) {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'taxflow-realm',
      clientId: 'taxflow-frontend',
    });
  }

  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    if (authenticated) {
       try {
      await firstValueFrom(this.usuarioService.getMiUsuario());
    } catch (error) {
      console.error('No se pudo sincronizar el usuario con el backend:', error);
      this.logout(); // Forzar logout si no está sincronizado
      return false;
    }
    }

    return authenticated;
  }

 

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getToken(): string {
    return this.keycloak.token ?? '';
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getUsername(): string {
    return (this.keycloak.tokenParsed as any)?.['preferred_username'] ?? '';
  }

  updateToken(minValidity = 30): Promise<boolean> {
    return this.keycloak.updateToken(minValidity);
  }

  getUserProfile(): Promise<KeycloakProfile | undefined> {
    return this.keycloak.loadUserProfile();
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.hasRole(r));
  }
}
