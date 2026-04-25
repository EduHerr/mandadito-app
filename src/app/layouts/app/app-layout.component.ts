import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dock } from '@components/dock/dock.component';
import { ToastComponent } from '@components/toast/toast.component';
import { ToastService } from '@libs/utils/sevices/toast/service';

@Component({
  imports: [Dock, RouterModule, ToastComponent],
  standalone: true,
  selector: 'app-layout',
  providers: [ToastService],
  templateUrl: './app-layout.component.html',
})
export class AppLayout {}
