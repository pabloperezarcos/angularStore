import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios'; // URL base del backend

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios del backend.
   * @returns Observable con una lista de usuarios.
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>('http://localhost:8080/api/usuarios').pipe(
      map(response => response._embedded?.usuariosList || [])
    );
  }
  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns Observable con los datos del usuario.
   */
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo usuario en el backend.
   * @param usuario Objeto con los datos del usuario a crear.
   * @returns Observable con el usuario creado.
   */
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  /**
   * Actualiza un usuario existente en el backend.
   * @param id ID del usuario a actualizar.
   * @param usuario Datos actualizados del usuario.
   * @returns Observable con el usuario actualizado.
   */
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  /**
   * Elimina un usuario por su ID.
   * @param id ID del usuario a eliminar.
   * @returns Observable que completa cuando el usuario se elimina.
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene un usuario por su correo electrónico.
   * @param email Correo del usuario.
   * @returns Observable con los datos del usuario.
   */
  getUsuarioByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }

  /**
   * Obtiene un usuario por su nombre de usuario.
   * @param username Nombre de usuario.
   * @returns Observable con los datos del usuario.
   */
  getUsuarioByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/username/${username}`);
  }
}
