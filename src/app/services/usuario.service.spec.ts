import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/usuarios';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuarioService,
        provideHttpClient(),
        provideHttpClientTesting(), // Configuración para pruebas
      ],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes después de cada prueba
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los usuarios', () => {
    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: 'Juan', username: 'juan123', email: 'juan@example.com', password: '', birthdate: '1990-01-01', address: '', rol: 'admin', imagen: '' },
      { id: 2, nombre: 'Maria', username: 'maria123', email: 'maria@example.com', password: '', birthdate: '1995-05-15', address: '', rol: 'cliente', imagen: '' },
    ];

    service.getUsuarios().subscribe(usuarios => {
      expect(usuarios).toEqual(mockUsuarios);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { usuariosList: mockUsuarios } });
  });

  it('debería obtener un usuario por email', () => {
    const mockUsuario: Usuario = {
      id: 1, nombre: 'Juan', username: 'juan123', email: 'juan@example.com', password: '', birthdate: '1990-01-01', address: '', rol: 'admin', imagen: '',
    };

    service.getUsuarioByEmail('juan@example.com').subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/email/juan@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('debería eliminar un usuario por ID', () => {
    service.eliminarUsuario(1).subscribe(response => {
      // Verifica que la respuesta sea null o undefined
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simula que el backend no retorna cuerpo en la respuesta
  });

});
