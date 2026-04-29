import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeleteButton } from "@components/button/delete/delete-button.component";
import { IProductSchema } from "@libs/modules/persistent/products/schema";
import { DateTime } from "luxon";

@Component({
    imports: [
        CommonModule,
        DeleteButton
    ],
    selector: "table-shopping-list",
    templateUrl: "./table-shopping-list.component.html",
    styleUrls: ["./table-shopping-list.component.css"],
})
export class TableShoppingList{
    @Input() products: IProductSchema[] = [];
    @Output() oDelete = new EventEmitter<string>();
    @Output() oEdit = new EventEmitter<string>();
    @Output() oShare = new EventEmitter<void>();

    dateTime = DateTime;

    eDrop(id: string){
        this.oDelete.emit(id);
    }

    onEdit(id: string){
        this.oEdit.emit(id);
    }

    share(){
        this.oShare.emit();
    }
}
