import { Component, OnInit } from "@angular/core";
import { TableHistorical } from "./table/table-historical.component";
import { ShoppingListaService } from "@libs/modules/persistent/shopping-list/service";
import { IShoppingListSchema } from "@libs/modules/persistent/shopping-list/schema";
import { ToastService } from "@libs/utils/sevices/toast/service";
import { EToastType } from "@components/toast/toast.component";

@Component({
    imports: [
        TableHistorical
    ],
    standalone: true,
    selector: 'app-historical',
    providers: [
        ShoppingListaService
    ],
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.css'],
})
export class HistoricalView implements OnInit{
    constructor(
        private readonly shoppingListService: ShoppingListaService,
        private readonly toastService: ToastService
    ){}

    shopingList: IShoppingListSchema[] = [];

    async ngOnInit(): Promise<void> {
        this.shopingList = await this.shoppingListService.get();
    }

    async drop(id: string): Promise<void> {
        // Delete from database
        await this.shoppingListService.delete(id);
        
        // Remove from the UI list
        this.shopingList = this.shopingList.filter(l => l._id !== id);

        // Show feedback
        this.toastService.show({
            type: EToastType.SUCCESS,
            text: 'Lista eliminada correctamente',
            duration: 3000
        });
    }
}
