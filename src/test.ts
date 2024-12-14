import 'zone.js/testing'; // Reemplaza ./dist/zone-testing
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

// Registrar datos de localización para 'es-CL'
registerLocaleData(localeEsCL);

// Inicializar el entorno de pruebas Angular
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
);
