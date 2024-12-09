import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * LoginComponent maneja la lógica y la interfaz para el inicio de sesión de usuarios.
 * Permite a los usuarios ingresar su nombre de usuario y contraseña para autenticarse.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Maneja el evento de login al enviar las credenciales al AuthService.
   */
  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe((success) => {
      if (success) {
        this.loginFailed = false;
        this.router.navigate(['/']); // Redirige al dashboard después del login exitoso
      } else {
        this.loginFailed = true; // Muestra un mensaje de error si el login falla
      }
    });
  }
}
