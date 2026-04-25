import { Component, OnInit } from "@angular/core";
import { TableHistorical } from "./table/table-historical.component";
import { ShoppingListaService } from "@libs/modules/persistent/shopping-list/service";
import { IShoppingListSchema } from "@libs/modules/persistent/shopping-list/schema";

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
        private readonly shoppingListService: ShoppingListaService
    ){}

    shopingList: IShoppingListSchema[] = [];

    async ngOnInit(): Promise<void> {
        this.shopingList = await this.shoppingListService.get();
    }
}
