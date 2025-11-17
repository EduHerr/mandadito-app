import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu } from './menu/menu.component';
import { ToastComponent } from '@components/toast/toast.component';
import { ToastService } from '@libs/utils/sevices/toast/service';

@Component({
  imports: [Menu, RouterModule, ToastComponent],
  standalone: true,
  selector: 'app-layout',
  providers: [ToastService],
  templateUrl: './app-layout.component.html',
})
export class AppLayout {}
