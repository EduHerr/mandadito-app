import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";

@Component({
    standalone: true,
    selector: "confirm-modal",
    templateUrl: "./confirm-modal.component.html",
    styleUrl: "./confirm-modal.component.css"
})
export class ConfirmModal{
    @Input() message: string = '';
    @Output() onConfirm = new EventEmitter<void>();
    @ViewChild('modalConfirm') modal!: ElementRef<HTMLDialogElement>;

    show(toggle?: boolean){
        const popUp = this.modal.nativeElement;
        if(toggle == false){
            popUp.close();
            return
        }
        popUp.showModal();
        return;
    }

    confirm(){
        this.show(false);
        this.onConfirm.emit();
    }
}
