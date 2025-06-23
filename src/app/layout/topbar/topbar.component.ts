import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'src/app/auth/keycloak.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  username: string = '';
   constructor(private keycloak: KeycloakService) {}

  logout(): void {
    this.keycloak.logout();
  }

  ngOnInit(): void {
     this.username = this.keycloak.getUsername();
  }

}
