import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Representa un usuario en el sistema.
 */
interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address: string;
  rol: string;
  imagen: string;
}

/**
 * PerfilComponent maneja la visualización y edición del perfil de usuario.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  /** Usuario actual */
  user: User | null = null;

  /** Indica si el modo de edición está activado */
  editMode: boolean = false;

  /** Indicador de carga */
  loading: boolean = false;

  /**
   * Constructor que inyecta el servicio de autenticación y usuario.
   * @param authService Servicio para gestionar la autenticación.
   * @param usuarioService Servicio para gestionar las operaciones relacionadas con usuarios.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService
  ) { }

  /**
   * Inicializa el componente obteniendo el usuario actual.
   */
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loading = true;
      this.usuarioService.getUsuarioByUsername(currentUser.username).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener el perfil del usuario:', err);
          this.loading = false;
        }
      });
    }
  }

  /**
   * Alterna el modo de edición del perfil.
   */
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-CL', options);
  }


  /**
   * Guarda los cambios realizados en el perfil de usuario.
   */
  saveProfile(): void {
    if (this.user) {
      this.loading = true;
      this.usuarioService.actualizarUsuario(this.user.id, this.user).subscribe({
        next: () => {
          this.editMode = false;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al guardar el perfil:', err);
          this.loading = false;
        }
      });
    }
  }
}
