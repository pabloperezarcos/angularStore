import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

/**
 * Representa un usuario en el sistema.
 */
interface User {
  /** Identificador único del usuario. */
  id: number;

  /** Nombre completo del usuario. */
  nombre: string;

  /** Nombre de usuario (username) del usuario. */
  username: string;

  /** Correo electrónico del usuario. */
  email: string;

  /** Contraseña del usuario. */
  password: string;

  /** Fecha de nacimiento del usuario. */
  birthdate: string;

  /** Dirección del usuario. */
  address: string;

  /** Rol del usuario en el sistema (e.g., administrador, cliente). */
  rol: string;

  /** URL de la imagen de perfil del usuario. */
  imagen: string;
}

/**
 * AuthService gestiona la autenticación de usuarios, incluyendo el inicio de sesión, cierre de sesión y almacenamiento de datos de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL para obtener los datos de usuarios */
  private apiUrl = 'app/assets/data/usuarios.json';
  /** Sujeto para el estado de autenticación */
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  /** Sujeto para el usuario actual */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  /** Lista de usuarios */
  private usuarios: User[] = [];

  /** Observable para el estado de autenticación */
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  /** Observable para el usuario actual */
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  /**
   * Constructor que inyecta el cliente HTTP y el identificador de plataforma.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param platformId Identificador de plataforma para verificar si es un navegador.
   */
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    this.loadUserFromLocalStorage();
  }

  /**
   * Guarda el usuario actual en el almacenamiento local si está disponible.
   */
  private saveUserToLocalStorage(): void {
    if (this.isLocalStorageAvailable() && this.currentUserSubject.value) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUserSubject.value));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  /**
   * Carga el usuario actual desde el almacenamiento local si está disponible.
   */
  private loadUserFromLocalStorage(): void {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('currentUser');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (user && isAuthenticated) {
        this.currentUserSubject.next(JSON.parse(user));
        this.isAuthenticatedSubject.next(isAuthenticated);
      }
    }
  }

  /**
   * Verifica si el almacenamiento local está disponible en el navegador.
   * @returns `true` si el almacenamiento local está disponible, `false` en caso contrario.
   */
  private isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  /**
   * Realiza el inicio de sesión verificando el nombre de usuario y la contraseña.
   * @param username Nombre de usuario.
   * @param password Contraseña.
   * @returns Observable que emite `true` si el inicio de sesión es exitoso, `false` en caso contrario.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<{ usuarios: User[] }>(this.apiUrl).pipe(
      map(response => {
        const user = response.usuarios.find(u => u.username === username && u.password === password);
        if (user) {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          this.saveUserToLocalStorage();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Realiza el cierre de sesión del usuario actual.
   */
  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }

  /**
   * Verifica si un usuario está autenticado.
   * @returns `true` si el usuario está autenticado, `false` en caso contrario.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtiene el usuario actual.
   * @returns El usuario actual o `null` si no hay usuario autenticado.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario actual es un administrador.
   * @returns `true` si el usuario actual es un administrador, `false` en caso contrario.
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === 'admin';
  }

  /**
   * Actualiza el perfil del usuario actual.
   * @param updatedUser Usuario actualizado.
   */
  updateUserProfile(updatedUser: User): void {
    const userIndex = this.usuarios.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      this.usuarios[userIndex] = updatedUser;
      this.currentUserSubject.next(updatedUser);
      this.saveUsersToLocalStorage(this.usuarios);
      this.saveUserToLocalStorage();
    }
  }

  /**
   * Añade un nuevo usuario.
   * @param newUser Nuevo usuario a añadir.
   */
  addUser(newUser: User): void {
    newUser.id = this.usuarios.length + 1;
    this.usuarios.push(newUser);
    this.saveUsersToLocalStorage(this.usuarios);
  }

  /**
   * Elimina un usuario.
   * @param user Usuario a eliminar.
   */
  deleteUser(user: User): void {
    this.usuarios = this.usuarios.filter(u => u.id !== user.id);
    this.saveUsersToLocalStorage(this.usuarios);
  }

  /**
   * Establece la lista de usuarios.
   * @param usuarios Lista de usuarios a establecer.
   */
  setUsuarios(usuarios: User[]): void {
    this.usuarios = usuarios;
    this.saveUsersToLocalStorage(this.usuarios);
  }

  /**
   * Obtiene todos los usuarios.
   * @returns Lista de todos los usuarios.
   */
  getAllUsers(): User[] {
    return this.usuarios;
  }

  /**
   * Obtiene los usuarios desde el almacenamiento local.
   * @returns Lista de usuarios.
   */
  private getUsersFromLocalStorage(): User[] {
    if (this.isLocalStorageAvailable()) {
      const usuariosJson = localStorage.getItem('usuarios');
      return usuariosJson ? JSON.parse(usuariosJson) : [];
    }
    return [];
  }

  /**
   * Guarda los usuarios en el almacenamiento local.
   * @param usuarios Lista de usuarios a guardar.
   */
  private saveUsersToLocalStorage(usuarios: User[]): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }
}
