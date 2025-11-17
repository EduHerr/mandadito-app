import { Injectable } from "@angular/core";
import { IToast } from "@components/toast/toast.component";
import { Subject } from "rxjs";

@Injectable()
export class ToastService {
  private readonly toastSubject = new Subject<IToast>();
  toast$ = this.toastSubject.asObservable();

  show(toast: IToast) {
    this.toastSubject.next(toast);
  }
}
