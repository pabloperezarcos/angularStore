import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  productos: Producto[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Obtener el término de búsqueda (puedes pasarlo desde el router)
    const query = new URLSearchParams(window.location.search).get('query');
    this.searchTerm = query || '';

    if (this.searchTerm) {
      this.searchProductos(this.searchTerm);
    } else {
      this.loading = false;
    }
  }

  searchProductos(term: string): void {
    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos.filter((producto) =>
          producto.nombre.toLowerCase().includes(term.toLowerCase())
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error buscando productos:', err);
        this.loading = false;
      }
    });
  }
}
