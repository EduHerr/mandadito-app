 import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('@layouts/app/app-layout.component').then(m => m.AppLayout),
    children: [
        { path: '', loadComponent: () => import('@views/home/home.component').then(m => m.HomeView) },
        { path: 'historical', loadComponent: () => import('@views/historical/historical.component').then(m => m.HistoricalView) },
        { path: 'shopping-list', loadComponent: () => import('@views/shopping-list/shopping-list.component').then(m => m.ShoppingListView) },
        { path: 'shopping-list/:id', loadComponent: () => import('@views/shopping-list/shopping-list.component').then(m => m.ShoppingListView) }
    ]
}];
