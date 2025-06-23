import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string): void {
    Swal.fire('¡Éxito!', message, 'success');
  }

  error(message: string): void {
    Swal.fire('Error', message, 'error');
  }

  info(message: string): void {
    Swal.fire('Información', message, 'info');
  }

  confirmEliminar(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then(result => result.isConfirmed);
  }
  
  confirm(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }
}
