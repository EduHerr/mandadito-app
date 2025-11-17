import { Component, Input } from "@angular/core";
import { IBreadCrumbItem } from "./types";

@Component({
    standalone: true,
    selector: "breadcrumbs",
    templateUrl: "./breadcrumbs.component.html",
    styleUrl: "./breadcrumbs.component.css"
})
export class BreadCrumbs{
    @Input() items!: IBreadCrumbItem[];
}
