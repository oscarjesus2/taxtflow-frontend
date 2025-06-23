import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  cliente: Cliente = {} as Cliente;
  esEdicion = false;
  estadoConexionFtp: boolean | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) { }



  probarConexionFTP() {
    const { ftpHost, ftpUsuario, ftpPassword } = this.cliente;
    this.clienteService.probarFtp({ ftpHost, ftpUsuario, ftpPassword }).subscribe({
      next: () => this.estadoConexionFtp = true,
      error: () => this.estadoConexionFtp = false
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.clienteService.getById(+id).subscribe(data => {
          this.cliente = data;
        });
      }
    });

  }

  guardar(): void {
    if (this.esEdicion) {
      this.clienteService.update(this.cliente.id!, this.cliente).subscribe(() => {
        this.router.navigate(['/clientes']);
      });
    } else {
      this.clienteService.create(this.cliente).subscribe(() => {
        this.router.navigate(['/clientes']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  resetEstadoConexion() {
    this.estadoConexionFtp = null;
  }
}