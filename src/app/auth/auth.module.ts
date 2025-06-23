import { NgModule } from "@angular/core";
import { KeycloakService } from "./keycloak.service";
import { AuthGuard } from "./guards/auth.guard";

@NgModule({
  providers: [
    KeycloakService,
    AuthGuard
  ]
})
export class AuthModule {}
