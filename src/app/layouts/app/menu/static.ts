import { IMenuItem } from './types';

export const menuOptions: IMenuItem[] = [
  { 
    label: 'Inicio', 
    icon: 'bi bi-house-door', 
    route: '/',
    isActive: false
  },
  {
    label: 'Despensa',
    icon: 'bi bi-cart',
    route: '/larder',
    isActive: true
  },
  { 
    label: 'Lista', 
    icon: 'bi bi-card-list',
    route: '/shopping-list',
    isActive: false
  },
];
