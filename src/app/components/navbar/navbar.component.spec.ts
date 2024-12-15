import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const carritoServiceMock = jasmine.createSpyObj('CarritoService', ['getItemCount'], {
      carritoActualizado: of([]),
    });

    carritoServiceMock.getItemCount.and.returnValue(5); // Simula que hay 5 ítems en el carrito

    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout', 'getCurrentUser'], {
      isAuthenticated$: of(true),
      currentUser$: of({ username: 'testuser', rol: 'cliente' }),
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component = TestBed.createComponent(NavbarComponent).componentInstance;
  });


  it('debería inicializar correctamente y calcular el contador de ítems del carrito', () => {
    component.ngOnInit();
    expect(component.cartItemCount).toBe(5); // 2 + 3
  });

  it('debería redirigir al buscar', () => {
    component.searchQuery = 'test';
    component.onSearch();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { query: 'test' },
    });
  });

  it('debería cerrar sesión y redirigir al login', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
