import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { menuOptions } from "@layouts/app/menu/static";

@Component({
    imports: [
    CommonModule,
    RouterModule
],
    selector: 'dock',
    standalone: true,
    templateUrl: './dock.component.html',
})
export class Dock{
    mItems = menuOptions;
}
