import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  selectedProduct: Producto | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchQuery: string = '';
  loading: boolean = false;

  private readonly productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProductos();
  }

  /**
   * Carga los productos desde el backend y actualiza la lista.
   */
  loadProductos(): void {
    this.loading = true;
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filteredProductos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Filtra los productos según la búsqueda.
   */
  filterProductos(): void {
    if (this.searchQuery) {
      this.filteredProductos = this.productos.filter(product =>
        product.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProductos = this.productos;
    }
  }

  /**
   * Selecciona un producto para edición.
   * @param product Producto seleccionado.
   */
  selectProduct(product: Producto): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
    this.isAdding = false;
  }

  /**
   * Crea o actualiza un producto según el modo actual (Agregar o Editar).
   */
  actualizarProducto(): void {
    if (this.isAdding && this.selectedProduct) {
      this.productService.crearProducto(this.selectedProduct).subscribe({
        next: () => {
          this.loadProductos();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error creando producto:', err);
          this.isAdding = true; // Mantener activo el estado de agregar
          this.isEditing = true; // Mantener activo el modo de edición
        },
      });
    } else if (this.selectedProduct?.id !== undefined) {
      this.productService.actualizarProducto(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: () => {
          this.loadProductos();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error actualizando producto:', err);
          this.isEditing = true; // Mantener activo el modo de edición
        },
      });
    }
  }



  /**
   * Elimina un producto.
   * @param product Producto a eliminar.
   */
  eliminarProducto(product: Producto): void {
    if (product.id) {
      this.productService.eliminarProducto(product.id).subscribe({
        next: () => this.loadProductos(),
        error: (err) => console.error('Error eliminando producto:', err)
      });
    }
  }

  /**
   * Cancela la edición o adición de un producto.
   */
  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  /**
   * Prepara el formulario para agregar un nuevo producto.
   */
  crearProducto(): void {
    this.selectedProduct = { id: 0, nombre: '', descripcion: '', precio: 0, imagenUrl: '' } as Producto;
    this.isAdding = true;
    this.isEditing = true;
  }
}
