import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ShoppingListaService } from "@libs/modules/persistent/shopping-list/service";
import { IShoppingListSchema } from "@libs/modules/persistent/shopping-list/schema";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: "app-home",
    providers: [ShoppingListaService],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeView implements OnInit {
    greeting = '';
    recentLists: IShoppingListSchema[] = [];
    totalLists = 0;

    constructor(
        private readonly shoppingListService: ShoppingListaService,
        private readonly router: Router,
    ) {}

    async ngOnInit(): Promise<void> {
        this.greeting = this.getGreeting();
        const allLists = await this.shoppingListService.get();
        this.totalLists = allLists.length;
        // Sort by lastUpdated desc and take top 3
        this.recentLists = allLists
            .sort((a, b) => (b.lastUpdated ?? 0) - (a.lastUpdated ?? 0));
    }

    navigateToList(id?: string): void {
        if (id) {
            this.router.navigate(['/shopping-list', id]);
        }
    }

    navigateToNewList(): void {
        this.router.navigate(['/shopping-list']);
    }

    navigateToHistorical(): void {
        this.router.navigate(['/historical']);
    }

    getProductsTotal(list: IShoppingListSchema): number {
        return list.products.reduce((sum, p) => sum + (p.totalCost ?? 0), 0);
    }

    private getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return '¡Buenos días!';
        if (hour < 18) return '¡Buenas tardes!';
        return '¡Buenas noches!';
    }
}