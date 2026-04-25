import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ConfirmModal } from "@components/modal/confirm/confirm-modal.component";

@Component({
    imports: [
        ConfirmModal
    ],
    standalone: true,
    selector: 'btn-delete',
    templateUrl: './delete-button.component.html',
    styleUrls: ['./delete-button.component.css'],
})
export class DeleteButton{
    @Output() oConfirm = new EventEmitter<void>();
    @ViewChild(ConfirmModal) modal!: ConfirmModal;

    show(){
        this.modal.show();
    }

    confirm(){
        this.oConfirm.emit();
    }
}
