import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormShoppingList } from './form/form-shopping-list.component';
import { TableShoppingList } from './table/table-shopping-list.component';
import { IProductSchema } from '@libs/modules/persistent/products/schema';
import { ProductService } from '@libs/modules/persistent/products/service';
import { ToastService } from '@libs/utils/sevices/toast/service';
import { EToastType } from '@components/toast/toast.component';
import { ShoppingListaService } from '@libs/modules/persistent/shopping-list/service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormShoppingList, TableShoppingList],
  selector: 'app-shopping-list',
  providers: [ProductService, ShoppingListaService],
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListView implements AfterViewInit {
  @ViewChild(FormShoppingList) formComponent!: FormShoppingList;
  @ViewChild(TableShoppingList) tableComponent!: TableShoppingList;

  items: IProductSchema[] = [];
  id: string | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly shoppinListService: ShoppingListaService,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');

    //Details by shopping-list
    if (this.id) {
      //Get the shopping-list details
      const shoppinList = await this.shoppinListService.findById(this.id);

      //Settear valores
      if (shoppinList) {
        const nameField = this.formComponent.lstNameField.name;

        shoppinList.products.map(
          (item) => (this.formComponent.totalCost += item.totalCost ?? 0)
        );
        this.ngZone.run(() => {
          this.items = shoppinList.products;
        });
        this.formComponent.lstNameField.name = shoppinList.alias
          ? shoppinList.alias
          : nameField;
      }
    }
  }

  async saveShoppingList() {
    //Validar si hay [productos] en la lista
    if (!(this.items.length > 0)) {
      this.toastService.show({
        type: EToastType.ERROR,
        text: 'Agrega productos a la lista antes de guardar',
        duration: 3000,
      });
      return;
    }

    //Save data
    const alias = this.formComponent.lstNameField?.name;
    const added = await this.shoppinListService.add({
      alias,
      products: this.items,
    });
    if (!added) {
      this.toastService.show({
        type: EToastType.ERROR,
        text: 'Error al intentar guardar la lista de compras',
        duration: 3000,
      });
      return;
    }

    this.toastService.show({
      type: EToastType.SUCCESS,
      text: 'Lista de compras guardada con éxito',
      duration: 3000,
    });

    //Clear everything
    this.formComponent.fShoppingList.reset(); //Form
    this.formComponent.totalCost = 0;
    this.items = []; //Table | List
  }

  async updateShoppingList() {
    //Get the values
    const alias =  this.formComponent.lstNameField.name;
    
    //Update
    if(this.id){
      const updated = await this.shoppinListService.update(this.id, { alias, products: this.items });
      if(!updated){
        this.toastService.show({ type: EToastType.ERROR, text: 'Error al intentar actualizar lista de compras', duration: 3000 })
        return;
      }

      //Success
      this.toastService.show({ type: EToastType.SUCCESS, text: 'Lista de compras actualizada', duration: 3000 })
      return;
    }
  }

  addProduct(item: IProductSchema) {
    this.items = [item, ...this.items];
    this.cdr.detectChanges();
    this.toastService.show({
      type: EToastType.SUCCESS,
      text: 'Producto agregado a la lista',
      duration: 3000,
    });
  }

  drop(id: string) {
    this.productService.delete(id); //Borramos de la BD

    //Notify
    this.toastService.show({
      type: EToastType.SUCCESS,
      text: 'Producto eliminado de la lista',
      duration: 3000,
    });

    //Descontamos del costo total
    const item = this.items.find((it) => it._id === id);
    this.formComponent.totalCost -= item?.totalCost ?? 0;
    this.items = this.items.filter((i) => i._id !== id); //Borramos de la data de la vista
  }

  edit(id: string) {
    const product = this.items.find((i) => i._id === id);
    this.formComponent.onEdit(product!);
  }

  updateProduct(updatedProduct: IProductSchema) {
    // Recalculate totalCost from scratch using the new array
    this.items = this.items.map((item) =>
      item._id === updatedProduct._id ? updatedProduct : item
    );
    this.toastService.show({
      type: EToastType.SUCCESS,
      text: 'Producto actualizado',
      duration: 3000,
    });
  }

  async shareList(): Promise<void> {
    if (this.items.length === 0) {
      this.toastService.show({
        type: EToastType.ERROR,
        text: 'Agrega productos antes de compartir',
        duration: 3000,
      });
      return;
    }

    const listName = this.formComponent.lstNameField?.name ?? 'Mi Lista';
    const total = this.formComponent.totalCost;

    // Build a readable text summary
    const lines = this.items.map(
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

    // Use Web Share API (WhatsApp, Telegram, etc.) on supported devices
    if (navigator.share) {
      try {
        await navigator.share({ title: listName, text });
        return;
      } catch (err) {
        // User cancelled or API failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
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
