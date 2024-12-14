import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  selectedUser: Usuario | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchQuery: string = '';
  passwordFieldType: string = 'password';
  loading: boolean = false;

  constructor(private readonly usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  /**
   * Carga los usuarios desde el backend.
   */
  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsuarios = [...this.usuarios];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loading = false;
      }
    });
  }



  /**
   * Filtra los usuarios según la búsqueda.
   */
  filterUsuarios(): void {
    if (this.searchQuery) {
      this.filteredUsuarios = this.usuarios.filter(user =>
        user.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsuarios = [...this.usuarios];
    }
  }

  /**
   * Selecciona un usuario para edición.
   * @param user Usuario seleccionado.
   */
  selectUser(user: Usuario): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.isAdding = false;
  }

  /**
   * Guarda el usuario editado o crea uno nuevo.
   */
  saveUser(): void {
    if (this.isAdding && this.selectedUser) {
      this.usuarioService.crearUsuario(this.selectedUser).subscribe({
        next: () => {
          this.loadUsuarios();
          this.cancelEdit();
        },
        error: (err) => console.error('Error creando usuario:', err)
      });
    } else if (this.selectedUser?.id !== undefined) {
      this.usuarioService.actualizarUsuario(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          this.loadUsuarios();
          this.cancelEdit();
        },
        error: (err) => console.error('Error actualizando usuario:', err)
      });
    }
  }

  /**
   * Elimina un usuario.
   * @param user Usuario a eliminar.
   */
  deleteUser(user: Usuario): void {
    if (user.id !== undefined) {
      this.usuarioService.eliminarUsuario(user.id).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => console.error('Error eliminando usuario:', err)
      });
    }
  }

  /**
   * Cancela el modo de edición/agregar.
   */
  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  /**
   * Prepara un nuevo usuario para ser añadido.
   */
  addUser(): void {
    this.selectedUser = {
      id: 0,
      nombre: '',
      username: '',
      email: '',
      password: '',
      birthdate: '',
      address: '',
      rol: 'cliente',
      imagen: ''
    };
    this.isAdding = true;
    this.isEditing = true;
  }

  /**
   * Alterna la visibilidad de la contraseña.
   */
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
