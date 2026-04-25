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
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnDestroy {
  toast: IToast | null = null;
  closing = false;
  duration = 3000;
  private sub!: Subscription;
  private timerSub?: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toast$.subscribe(toast => {
      // Cancel any existing timer
      this.timerSub?.unsubscribe();
      this.closing = false;

      this.toast = toast;
      this.duration = toast.duration ?? 3000;

      // Start close animation before removing
      this.timerSub = timer(this.duration - 300).subscribe(() => {
        this.closing = true;
        timer(300).subscribe(() => {
          this.toast = null;
          this.closing = false;
        });
      });
    });
  }

  get icon(): string {
    if (!this.toast) return '';
    switch (this.toast.type) {
      case EToastType.SUCCESS: return 'bi bi-check-circle-fill';
      case EToastType.ERROR: return 'bi bi-x-circle-fill';
      case EToastType.INFO: return 'bi bi-info-circle-fill';
    }
  }

  dismiss(): void {
    this.timerSub?.unsubscribe();
    this.closing = true;
    timer(300).subscribe(() => {
      this.toast = null;
      this.closing = false;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    this.timerSub?.unsubscribe();
  }
}
