import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { menuOptions } from "@layouts/app/menu/static";

@Component({
    imports: [
        CommonModule,
        RouterModule
    ],
    standalone: true,
    selector: "drawer",
    templateUrl: "./drawer.component.html",
    styleUrls: ["./drawer.component.css"],
})
export class Drawer {
    mItems = menuOptions;
}
