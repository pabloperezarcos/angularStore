import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('AdminUsuariosComponent', () => {
  let component: AdminUsuariosComponent;
  let fixture: ComponentFixture<AdminUsuariosComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUsuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      username: 'juanp',
      email: 'juan@example.com',
      password: '123456',
      birthdate: '1990-01-01',
      address: 'Calle 123',
      rol: 'cliente',
      imagen: ''
    },
    {
      id: 2,
      nombre: 'María López',
      username: 'marial',
      email: 'maria@example.com',
      password: 'abcdef',
      birthdate: '1985-05-20',
      address: 'Avenida 456',
      rol: 'cliente',
      imagen: ''
    }
  ];

  beforeEach(async () => {
    const usuarioServiceMock = jasmine.createSpyObj('UsuarioService', [
      'getUsuarios',
      'crearUsuario',
      'actualizarUsuario',
      'eliminarUsuario',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminUsuariosComponent], // El componente es standalone
      providers: [
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: usuarioServiceMock },
      ],
    }).compileComponents();

    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    fixture = TestBed.createComponent(AdminUsuariosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios al inicializar', () => {
    usuarioService.getUsuarios.and.returnValue(of(mockUsuarios));

    component.ngOnInit();

    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual(mockUsuarios);
    expect(component.filteredUsuarios).toEqual(mockUsuarios);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar errores al cargar usuarios', () => {
    usuarioService.getUsuarios.and.returnValue(throwError(() => new Error('Error al cargar usuarios')));

    component.ngOnInit();

    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual([]);
    expect(component.filteredUsuarios).toEqual([]);
    expect(component.loading).toBeFalse();
  });

  it('debería filtrar usuarios según la búsqueda', () => {
    component.usuarios = mockUsuarios;
    component.searchQuery = 'Juan';

    component.filterUsuarios();

    expect(component.filteredUsuarios.length).toBe(1);
    expect(component.filteredUsuarios[0].nombre).toBe('Juan Pérez');
  });

  it('debería seleccionar un usuario para edición', () => {
    const usuario = mockUsuarios[0];

    component.selectUser(usuario);

    expect(component.selectedUser).toEqual(usuario);
    expect(component.isEditing).toBeTrue();
    expect(component.isAdding).toBeFalse();
  });

  it('debería guardar un nuevo usuario', () => {
    const newUser: Usuario = {
      id: 0,
      nombre: 'Nuevo Usuario',
      username: 'nuevo',
      email: 'nuevo@example.com',
      password: 'password',
      birthdate: '2000-01-01',
      address: 'Calle Nueva',
      rol: 'cliente',
      imagen: ''
    };

    component.selectedUser = newUser;
    component.isAdding = true;

    usuarioService.crearUsuario.and.returnValue(of(newUser));
    usuarioService.getUsuarios.and.returnValue(of([...mockUsuarios, newUser]));

    component.saveUser();

    expect(usuarioService.crearUsuario).toHaveBeenCalledWith(newUser);
    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
    expect(component.isAdding).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('debería manejar errores al crear un usuario', () => {
    const newUser: Usuario = {
      id: 0,
      nombre: 'Nuevo Usuario',
      username: 'nuevo',
      email: 'nuevo@example.com',
      password: 'password',
      birthdate: '2000-01-01',
      address: 'Calle Nueva',
      rol: 'cliente',
      imagen: ''
    };

    component.selectedUser = newUser;
    component.isAdding = true;
    component.isEditing = true;

    usuarioService.crearUsuario.and.returnValue(throwError(() => new Error('Error al crear usuario')));

    component.saveUser();

    expect(usuarioService.crearUsuario).toHaveBeenCalledWith(newUser);
    expect(component.isAdding).toBeTrue();
    expect(component.isEditing).toBeTrue();
  });


  it('debería actualizar un usuario existente', () => {
    const updatedUser = { ...mockUsuarios[0], nombre: 'Juan Actualizado' };

    component.selectedUser = updatedUser;
    component.isAdding = false;

    usuarioService.actualizarUsuario.and.returnValue(of(updatedUser));
    usuarioService.getUsuarios.and.returnValue(of([updatedUser, mockUsuarios[1]]));

    component.saveUser();

    expect(usuarioService.actualizarUsuario).toHaveBeenCalledWith(updatedUser.id, updatedUser);
    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('debería eliminar un usuario', () => {
    const usuario = mockUsuarios[0];

    usuarioService.eliminarUsuario.and.returnValue(of(undefined));
    usuarioService.getUsuarios.and.returnValue(of([mockUsuarios[1]]));

    component.deleteUser(usuario);

    expect(usuarioService.eliminarUsuario).toHaveBeenCalledWith(usuario.id);
    expect(usuarioService.getUsuarios).toHaveBeenCalled();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.passwordFieldType).toBe('password');

    component.togglePasswordVisibility();

    expect(component.passwordFieldType).toBe('text');

    component.togglePasswordVisibility();

    expect(component.passwordFieldType).toBe('password');
  });

  it('debería preparar un nuevo usuario para ser agregado', () => {
    component.addUser();

    expect(component.selectedUser).toEqual({
      id: 0,
      nombre: '',
      username: '',
      email: '',
      password: '',
      birthdate: '',
      address: '',
      rol: 'cliente',
      imagen: ''
    });
    expect(component.isAdding).toBeTrue();
    expect(component.isEditing).toBeTrue();
  });
});
