import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUser = {
    id: 1,
    nombre: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    birthdate: '1990-01-01',
    address: '123 Main St',
    rol: 'cliente',
    imagen: '/assets/default-profile.png',
  };

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const usuarioServiceMock = jasmine.createSpyObj('UsuarioService', [
      'getUsuarioByUsername',
      'actualizarUsuario',
    ]);

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsuarioService, useValue: usuarioServiceMock },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el perfil del usuario al inicializar', () => {
    authService.getCurrentUser.and.returnValue({ username: 'testuser' });
    usuarioService.getUsuarioByUsername.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.user).toEqual(mockUser);
    expect(usuarioService.getUsuarioByUsername).toHaveBeenCalledWith('testuser');
  });

  it('debería manejar errores al obtener el perfil del usuario', () => {
    authService.getCurrentUser.and.returnValue({ username: 'testuser' });
    usuarioService.getUsuarioByUsername.and.returnValue(throwError(() => new Error('Error de red')));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.user).toBeNull();
    expect(usuarioService.getUsuarioByUsername).toHaveBeenCalledWith('testuser');
  });

  it('debería alternar el modo de edición', () => {
    expect(component.editMode).toBeFalse();
    component.toggleEditMode();
    expect(component.editMode).toBeTrue();
  });

  it('debería guardar el perfil del usuario correctamente', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre: 'Test',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      address: 'Test Address',
      rol: 'user',
      imagen: '/assets/test-profile.png',
    };

    component.user = mockUsuario; // Configura el usuario actual en el componente
    usuarioService.actualizarUsuario.and.returnValue(of(mockUsuario)); // Simula un guardado exitoso

    component.saveProfile(); // Llama al método de guardar

    expect(component.loading).toBeFalse();
    expect(component.editMode).toBeFalse();
    expect(usuarioService.actualizarUsuario).toHaveBeenCalledWith(mockUsuario.id, mockUsuario);
  });



  it('debería manejar errores al guardar el perfil del usuario', () => {
    component.user = {
      id: 1,
      nombre: 'Test',
      username: 'testuser',
      email: '',
      password: '',
      birthdate: '',
      address: '',
      rol: 'user',
      imagen: ''
    };

    usuarioService.actualizarUsuario.and.returnValue(throwError(() => new Error('Error al guardar')));

    component.saveProfile();

    expect(component.loading).toBeFalse(); // Verifica que loading se desactiva
    expect(component.editMode).toBeTrue(); // Verifica que editMode permanece activo
    expect(usuarioService.actualizarUsuario).toHaveBeenCalledWith(1, component.user);
  });

  it('debería formatear la fecha correctamente', () => {
    const date = '1990-01-01T00:00:00Z'; // Fecha en UTC
    const formattedDate = component.getFormattedDate(date);

    expect(formattedDate).toBe('01 de enero de 1990'); // Ajusta la expectativa
  });


});
