import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductService } from '../../services/product.service';

/**
 * CatalogoComponent maneja la visualización del catálogo de productos.
 */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  /** Lista de productos */
  productos: Producto[] = [];

  /** Indicador de carga */
  loading = true;

  /**
   * Constructor que inyecta el servicio de productos.
   */
  constructor(private productService: ProductService) { }

  /**
   * Inicializa el componente cargando los productos.
   */
  ngOnInit(): void {
    this.loadProductos();
  }

  /**
   * Carga los productos desde el servicio.
   */
  private loadProductos(): void {
    this.productService.getProductos().subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data); // Log para depuración
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo productos:', err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa'),
    });
  }
}
