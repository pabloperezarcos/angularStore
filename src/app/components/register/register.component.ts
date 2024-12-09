import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  /** Datos del formulario */
  nombre: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  birthdate: string = '';
  address: string = '';

  /** Mensajes de feedback */
  errorMessage: string = '';
  successMessage: string = '';

  /** Indica si la contraseña debe ser visible */
  showPassword: boolean = false;

  /**
   * Constructor que inyecta el servicio de usuario y enrutamiento.
   * @param usuarioService Servicio para gestionar usuarios.
   * @param router Servicio de enrutamiento para navegar entre vistas.
   */
  constructor(private usuarioService: UsuarioService, private router: Router) { }

  /**
   * Maneja el registro de nuevos usuarios.
   */
  onRegister(): void {
    const newUser: Usuario = {
      id: 0,
      nombre: this.nombre,
      username: this.username,
      email: this.email,
      password: this.password,
      birthdate: this.birthdate,
      address: this.address,
      rol: 'cliente', // Rol predeterminado
      imagen: '/assets/default-profile.png',
    };

    this.usuarioService.crearUsuario(newUser).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirige tras 2 segundos
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        this.errorMessage = 'Hubo un problema al registrar. Por favor, inténtalo de nuevo.';
        this.successMessage = '';
      },
    });
  }

  /**
   * Alterna la visibilidad de la contraseña.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}