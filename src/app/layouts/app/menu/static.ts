import { IMenuItem } from './types';

export const menuOptions: IMenuItem[] = [
  { 
    label: 'Inicio', 
    icon: 'bi bi-house-door-fill', 
    route: '/',
  },
  {
    label: 'Histórico',
    icon: 'bi bi-clock-history',
    route: '/historical',
  },
  { 
    label: 'Nueva Lista', 
    icon: 'bi bi-cart-plus-fill',
    route: '/shopping-list',
  },
];
