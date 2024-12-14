import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  errorMessage: string = '';

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute // Usamos ActivatedRoute para obtener parámetros de consulta
  ) { }

  ngOnInit(): void {
    // Obtener el término de búsqueda desde los queryParams
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['query'] || '';

      if (this.searchTerm) {
        this.searchProductos(this.searchTerm);
      } else {
        this.loading = false;
      }
    });
  }

  searchProductos(term: string): void {
    this.productService.searchProductos(term).subscribe({
      next: (productos) => {
        this.productos = productos; // El backend debería filtrar los productos
        this.loading = false;
      },
      error: (err) => {
        console.error('Error buscando productos:', err);
        this.errorMessage = 'Hubo un error al cargar los resultados de búsqueda.';
        this.loading = false;
      }
    });
  }
}
