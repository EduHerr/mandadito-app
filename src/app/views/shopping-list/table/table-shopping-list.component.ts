import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DeleteButton } from "@components/button/delete/delete-button.component";
import { IProductSchema } from "@libs/modules/persistent/products/schema";
import { DateTime } from "luxon";

@Component({
    imports: [
        DeleteButton
    ],
    selector: "table-shopping-list",
    templateUrl: "./table-shopping-list.component.html"
})
export class TableShoppingList{
    @Input() products: IProductSchema[] = [];
    @Output() oDelete = new EventEmitter<string>();
    @Output() oEdit = new EventEmitter<string>();

    isEdit: boolean = false;
    dateTime = DateTime;

    eDrop(id: string){
        this.oDelete.emit(id);
    }

    onEdit(id: string){
        this.oEdit.emit(id);
        this.isEdit = true;
    }
}
