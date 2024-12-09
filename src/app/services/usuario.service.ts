import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * AuthService maneja la autenticación de usuarios mediante la comunicación con el backend.
 * Proporciona métodos para iniciar sesión, cerrar sesión y verificar el estado de autenticación.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL del endpoint de login en el backend */
  private loginUrl = 'http://localhost:8080/api/login'; // Asegúrate de que este endpoint exista en tu backend

  /** Clave para almacenar el token en el localStorage */
  private TOKEN_KEY = 'authToken';

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param http Servicio HttpClient para realizar solicitudes HTTP.
   * @param router Servicio Router para la navegación.
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Inicia sesión enviando las credenciales al backend.
   * @param username Nombre de usuario ingresado.
   * @param password Contraseña ingresada.
   * @returns Observable<boolean> que indica si el inicio de sesión fue exitoso.
   */
  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post<any>(this.loginUrl, body, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          // Almacena el token en el localStorage
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      }),
      map(response => !!response.token), // Retorna true si el token existe
      catchError(error => {
        console.error('Error durante el inicio de sesión:', error);
        return of(false); // Retorna false en caso de error
      })
    );
  }

  /**
   * Cierra la sesión eliminando el token del localStorage y redirigiendo al login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado comprobando la existencia del token.
   * @returns boolean indicando el estado de autenticación.
   */
  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  /**
   * Obtiene el token de autenticación almacenado.
   * @returns El token JWT como string o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
