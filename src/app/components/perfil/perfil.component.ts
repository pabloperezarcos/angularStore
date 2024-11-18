import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  usuario = {
    nombre: '',
    email: '',
    telefono: ''
  };

  onSubmit() {
    // Lógica para guardar los cambios en el perfil del usuario
    console.log('Perfil actualizado:', this.usuario);
  }
}
