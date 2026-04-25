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
import { ShoppinListRepository } from '@libs/modules/persistent/shopping-list/repository';
import { IShoppingListRepository } from '@libs/modules/persistent/shopping-list/adapter';
import { ISnapshotRepository } from '@libs/modules/persistent/snapshot/adapter';
import { SnapshotRepository } from '@libs/modules/persistent/snapshot/repository';

export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>('PRODUCT_REPOSITORY');
export const SHOPPING_LIST_REPOSITORY = new InjectionToken<IShoppingListRepository>('SHOPPING_LIST_REPOSITORY');
export const SNAPSHOT_REPOSITORY = new InjectionToken<ISnapshotRepository>('SNAPSHOT_REPOSITORY');

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
    ,
    {
      provide: SHOPPING_LIST_REPOSITORY,
      useClass: ShoppinListRepository
    },
    {
      provide: SNAPSHOT_REPOSITORY,
      useClass: SnapshotRepository
    },
  ],
};
