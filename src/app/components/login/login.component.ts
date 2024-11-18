import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /** Nombre de usuario ingresado */
  username: string = '';

  /** Contraseña ingresada */
  password: string = '';

  /** Mensaje de error para mostrar en caso de fallo en el inicio de sesión */
  errorMessage: string = '';

  onLogin() {
    // Lógica para autenticar al usuario
    console.log('Usuario autenticado:', this.username);
  }
}
