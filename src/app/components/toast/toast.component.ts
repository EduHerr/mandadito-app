import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ToastService } from '@libs/utils/sevices/toast/service';
import { Subscription, timer } from 'rxjs';

export enum EToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export interface IToast {
  type: EToastType;
  text: string;
  duration?: number;
}

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnDestroy {
  toast: IToast | null = null;
  private sub!: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
      const duration = toast.duration ?? 3000;

      timer(duration).subscribe(() => {
        this.toast = null;
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
