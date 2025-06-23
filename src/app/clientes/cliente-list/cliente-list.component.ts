import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listarPropios().subscribe(data => this.clientes = data);
  }
  nuevoCliente() {
    this.router.navigate(['/clientes/form']);
  }

  editarCliente(cliente: Cliente) {
    this.router.navigate(['/clientes/form'], { queryParams: { id: cliente.id } });
  }
}
