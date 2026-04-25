import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButton } from '@components/button/delete/delete-button.component';
import { IShoppingListSchema } from '@libs/modules/persistent/shopping-list/schema';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
  imports: [CommonModule, DeleteButton],
  standalone: true,
  selector: 'table-historical',
  templateUrl: './table-historical.component.html',
  styleUrls: ['./table-historical.component.css'],
})
export class TableHistorical {
  @Input() shoppingLists: IShoppingListSchema[] = [];

  @Output() oDelete = new EventEmitter<string>();

  constructor(
    private readonly router: Router
  ){}

  dateTime = DateTime;

  getListTotal(list: IShoppingListSchema): number {
    return list.products.reduce((sum, p) => sum + (p.totalCost ?? 0), 0);
  }

  drop(id: string){
    this.oDelete.emit(id);
  }

  onEdit(id: string){
    this.router.navigate(['shopping-list', id]);
  }

  navigateToNewList(): void {
    this.router.navigate(['/shopping-list']);
  }
}
