import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButton } from '@components/button/delete/delete-button.component';
import { IShoppingListSchema } from '@libs/modules/persistent/shopping-list/schema';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { ToastService } from '@libs/utils/sevices/toast/service';
import { EToastType } from '@components/toast/toast.component';

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
    private readonly router: Router,
    private readonly toastService: ToastService,
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

  async shareItem(list: IShoppingListSchema): Promise<void> {
    const listName = list.alias || 'Mi Lista';
    const total = this.getListTotal(list);

    const lines = list.products.map(
      (p, i) => `${i + 1}. ${p.name} — ${p.quantity} uds × $${p.unit_cost} = $${(p.totalCost ?? 0).toFixed(2)}`
    );

    const text = [
      `🛒 *${listName}*`,
      '',
      ...lines,
      '',
      `💰 *Total: $${total.toFixed(2)}*`,
      '',
      '— Compartido desde Mandadito 🍊',
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: listName, text });
        return;
      } catch {
        // User cancelled — fall through
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      this.toastService.show({
        type: EToastType.SUCCESS,
        text: 'Lista copiada al portapapeles',
        duration: 3000,
      });
    } catch {
      this.toastService.show({
        type: EToastType.ERROR,
        text: 'No se pudo compartir la lista',
        duration: 3000,
      });
    }
  }
}
