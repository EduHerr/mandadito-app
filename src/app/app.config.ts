import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  InjectionToken,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { IProductRepository } from '@libs/modules/persistent/products/adapter';
import { ProductRepository } from '@libs/modules/persistent/products/repository';

export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>('PRODUCT_REPOSITORY');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository
    }
  ],
};
