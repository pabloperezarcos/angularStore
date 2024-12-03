import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

/**
 * NavbarComponent maneja la barra de navegación del sitio, incluyendo la búsqueda, el acceso al carrito y la gestión de la sesión de usuario.
 * Está diseñado para ser un componente independiente con su propia gestión de estado y lógica.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NavbarComponent implements OnInit {
  /** Query de búsqueda introducido por el usuario */
  searchQuery: string = '';

  /** Contador de items en el carrito de compras */
  cartItemCount: number = 0;

  /** Estado de autenticación del usuario */
  isLoggedIn: boolean = false;

  /** Si el usuario es administrador */
  isAdmin: boolean = false;

  /** Información del usuario actual */
  currentUser: any = null;

  /**
   * Constructor que inyecta dependencias para manejar rutas, carrito de compras y autenticación.
   * @param router Servicio de enrutamiento para la navegación.
   * @param carritoService Servicio para gestionar el carrito de compras.
   * @param authService Servicio para gestionar la autenticación de usuarios.
   */
  constructor(private router: Router, private carritoService: CarritoService, private authService: AuthService) { }

  /**
   * Inicializa el componente suscribiéndose a los observables de autenticación y actualizaciones del carrito.
   */
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      this.isAdmin = this.authService.getCurrentUser()?.rol === 'admin';
    });
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.cartItemCount = this.carritoService.getItemCount();
    this.carritoService.carritoActualizado.subscribe(() => {
      this.cartItemCount = this.carritoService.getItemCount();
    });
  }

  /**
   * Gestiona la búsqueda realizada por el usuario redirigiendo a la página de búsqueda con los parámetros adecuados.
   */
  onSearch(): void {
    if (this.searchQuery) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }

  /**
   * Cierra la sesión del usuario y redirige a la página principal.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
