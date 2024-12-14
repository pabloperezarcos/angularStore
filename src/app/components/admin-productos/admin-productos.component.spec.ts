import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductosComponent } from './admin-productos.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';

describe('AdminProductosComponent', () => {
  let component: AdminProductosComponent;
  let fixture: ComponentFixture<AdminProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductosComponent], // Asegúrate de que el componente sea standalone
      providers: [
        provideHttpClientTesting(), // Provee HttpClient para pruebas
        ProductService, // Incluye el servicio si no es standalone
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
