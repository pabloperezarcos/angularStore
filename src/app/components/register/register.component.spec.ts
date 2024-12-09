import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: any;
  let usuarioService: UsuarioService;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        UsuarioService,
      ],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería registrar un usuario correctamente', () => {
    const mockUsuario = {
      id: 0,
      nombre: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '2000-01-01',
      address: '123 Street',
      rol: 'cliente',
      imagen: '/assets/default-profile.png',
    };

    component.nombre = mockUsuario.nombre;
    component.username = mockUsuario.username;
    component.email = mockUsuario.email;
    component.password = mockUsuario.password;
    component.birthdate = mockUsuario.birthdate;
    component.address = mockUsuario.address;

    component.onRegister();

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUsuario);
    req.flush(mockUsuario);

    expect(component.successMessage).toBe('Registro exitoso. Ahora puedes iniciar sesión.');
    expect(component.errorMessage).toBe('');
    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }, 2000);
  });

  it('debería manejar errores al registrar un usuario', () => {
    component.nombre = 'Error User';
    component.onRegister();

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));

    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('Hubo un problema al registrar. Por favor, inténtalo de nuevo.');
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });
});
