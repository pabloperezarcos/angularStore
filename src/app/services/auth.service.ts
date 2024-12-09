import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/login'; // URL del backend para login
  private AUTH_KEY = 'isLoggedIn'; // Clave para guardar el estado de autenticación

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Recuperar el usuario del localStorage al cargar la aplicación
  constructor(private http: HttpClient, private router: Router) {
    const isLoggedIn = this.isBrowser() && this.isLoggedIn();
    const storedUser = this.isBrowser() ? localStorage.getItem('currentUser') : null;

    this.isAuthenticatedSubject.next(isLoggedIn);
    if (isLoggedIn && storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Verifica si estamos en un navegador.
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Enviar las credenciales al backend para autenticación.
   * @param username Nombre de usuario.
   * @param password Contraseña.
   * @returns Observable<boolean> indicando si el login fue exitoso.
   */
  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post<{ message: string, user: any }>(this.loginUrl, body, { headers }).pipe(
      tap((response) => {
        if (response.message === 'Login exitoso') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(response.user)); // Guardar usuario completo
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user); // Actualizar BehaviorSubject
        }
      }),
      map((response) => response.message === 'Login exitoso'),
      catchError((error) => {
        console.error('Error durante el login:', error);
        return of(false);
      })
    );
  }



  /**
 * Verifica si el usuario tiene rol de administrador.
 * @returns boolean indicando si el usuario es administrador.
 */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }




  /**
   * Eliminar el estado de autenticación y redirigir al login.
   */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.AUTH_KEY);
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns boolean indicando el estado de autenticación.
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser()) {
      return false;
    }
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  /**
   * Obtiene el usuario actual desde el BehaviorSubject.
   * @returns El usuario actual o null si no hay usuario autenticado.
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
