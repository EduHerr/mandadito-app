import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { menuOptions } from "@layouts/app/menu/static";

@Component({
    imports: [
        CommonModule,
        RouterModule
    ],
    selector: 'dock',
    standalone: true,
    templateUrl: './dock.component.html',
    styleUrls: ['./dock.component.css'],
})
export class Dock {
    mItems = menuOptions;

    constructor(private readonly router: Router) {}

    isActive(route: string): boolean {
        if (route === '/') {
            return this.router.url === '/';
        }
        return this.router.url.startsWith(route);
    }
}
