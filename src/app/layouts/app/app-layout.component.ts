import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { Dock } from '@components/dock/dock.component';
import { ToastComponent, EToastType } from '@components/toast/toast.component';
import { ToastService } from '@libs/utils/sevices/toast/service';

@Component({
  imports: [Dock, RouterModule, ToastComponent],
  standalone: true,
  selector: 'app-layout',
  providers: [ToastService],
  templateUrl: './app-layout.component.html',
})
export class AppLayout {
  private readonly toastService = inject(ToastService);
  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toastService.show({
          type: EToastType.INFO,
          text: 'Hay una nueva versión disponible. Recargando…',
          duration: 4000,
        });
        setTimeout(() => document.location.reload(), 4000);
      });
  }
}
