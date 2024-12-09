import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = { id: 1, username: 'admin', rol: 'admin' }; // Usuario de prueba
  const mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        AuthService,
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      for (const key in mockLocalStorage) {
        delete mockLocalStorage[key];
      }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar sesión correctamente y actualizar el estado', (done) => {
    const mockResponse = { message: 'Login exitoso', user: mockUser };

    service.login('testUser', 'password').subscribe((result) => {
      expect(result).toBeTrue();
      expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
      expect(service.getCurrentUser()).toEqual(mockUser);
      expect(service.isLoggedIn()).toBeTrue();
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería manejar errores al iniciar sesión', (done) => {
    service.login('testUser', 'wrongPassword').subscribe((result) => {
      expect(result).toBeFalse(); // El resultado debe ser false en caso de error
      expect(localStorage.setItem).not.toHaveBeenCalled(); // localStorage no debería ser llamado
      expect(service.getCurrentUser()).toBeNull(); // El usuario actual debe ser null
      expect(service.isLoggedIn()).toBeFalse(); // El estado de inicio de sesión debe ser falso
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Login fallido' }, { status: 401, statusText: 'Unauthorized' }); // Simular error 401
  });


  it('debería cerrar sesión correctamente', () => {
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería verificar si el usuario tiene rol de admin', () => {
    // Simular usuario con rol de admin en localStorage
    mockLocalStorage['currentUser'] = JSON.stringify(mockUser);
    service['currentUserSubject'].next(mockUser); // Configurar el valor inicial en el BehaviorSubject

    expect(service.isAdmin()).toBeTrue();
  });

  it('debería obtener el usuario actual desde el BehaviorSubject', () => {
    // Simular usuario actual en localStorage
    mockLocalStorage['currentUser'] = JSON.stringify(mockUser);
    service['currentUserSubject'].next(mockUser); // Configurar el valor inicial en el BehaviorSubject

    expect(service.getCurrentUser()).toEqual(mockUser);
  });

});
