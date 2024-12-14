import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * LoginComponent maneja la lógica y la interfaz para el inicio de sesión de usuarios.
 * Permite a los usuarios ingresar su nombre de usuario y contraseña para autenticarse.
 * */

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

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  /**
   * Maneja el evento de login al enviar las credenciales al AuthService.
   */
  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (success: boolean) => {
        const response = { success };
        this.handleLoginResponse(response);
      },
      error: (error) => {
        console.error('Error durante el login:', error);
        this.handleLoginError();
      }
    });

  }

  /**
   * Maneja la respuesta del servicio de autenticación.
   * @param response Respuesta del servicio de login.
   */
  private handleLoginResponse(response: { success: boolean }): void {
    if (response.success) {
      this.handleLoginSuccess();
    } else {
      this.handleLoginFailure();
    }
  }

  /**
   * Lógica para manejar un inicio de sesión exitoso.
   */
  private handleLoginSuccess(): void {
    this.loginFailed = false;
    this.router.navigate(['/']); // Redirige al dashboard
  }

  /**
   * Lógica para manejar un inicio de sesión fallido.
   */
  private handleLoginFailure(): void {
    this.loginFailed = true; // Muestra un mensaje de error si el login falla
  }

  /**
   * Lógica para manejar errores durante el inicio de sesión.
   */
  private handleLoginError(): void {
    console.error('Se produjo un error en el servidor o en la conexión.');
    this.loginFailed = true; // Consideramos que el error también indica un fallo en el login
  }
}
