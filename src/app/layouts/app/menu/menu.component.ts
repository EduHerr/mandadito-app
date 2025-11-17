import { Component } from "@angular/core";
import { Dock } from "@components/dock/dock.component";
import { Drawer } from "@components/drawer/drawer.component";

@Component({
    standalone: true,
    imports: [
        Drawer,
        Dock,
    ],
    selector: 'menu',
    templateUrl: './menu.component.html'
})
export class Menu{}
