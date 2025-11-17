import { Component, OnInit, ViewChild } from '@angular/core';
import { FormShoppingList } from './form/form-shopping-list.component';
import { BreadCrumbs } from '@components/breadcrumbs/breadcrumbs.component';
import { TableShoppingList } from './table/table-shopping-list.component';
import { IProductSchema } from '@libs/modules/persistent/products/schema';
import { ProductService } from '@libs/modules/persistent/products/service';
import { ToastService } from '@libs/utils/sevices/toast/service';
import { EToastType } from '@components/toast/toast.component';

@Component({
  standalone: true,
  imports: [FormShoppingList, BreadCrumbs, TableShoppingList],
  selector: 'app-shopping-list',
  providers: [ProductService],
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListView implements OnInit {
  @ViewChild(FormShoppingList) formComponent!: FormShoppingList;
  @ViewChild(TableShoppingList) tableComponent!: TableShoppingList;

  items: IProductSchema[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly toastService: ToastService
  ){}

  async ngOnInit(): Promise<void> {
    this.items = await this.productService.get() || [];
    this.items.forEach(item => { this.formComponent.totalCost += item.totalCost ?? 0; }); //TotalCost
  }

  saveShoppingList() {
    //Validar si hay [productos] en la lista
    if(!(this.items.length > 0)){
      this.toastService.show({ type: EToastType.ERROR, text: 'Agrega productos a la lista antes de guardar', duration: 3000});
    }

    //
  }

  addProduct(item: IProductSchema) {
    this.items.unshift(item);
    this.toastService.show({ type: EToastType.SUCCESS, text: 'Producto agregado a la lista', duration: 3000});
  }

  drop(id: string) {
    this.productService.delete(id); //Borramos de la BD 

    //Notify
    this.toastService.show({ type: EToastType.SUCCESS, text: 'Producto eliminado de la lista', duration: 3000});

    //Descontamos del costo total
    const item = this.items.find(it => it._id === id); 
    this.formComponent.totalCost -= item?.totalCost ?? 0;
    this.items = this.items.filter((i) => i._id !== id); //Borramos de la data de la vista
  }

  edit(id: string) {
    const product = this.items.find((i) => i._id === id);
    this.formComponent.onEdit(product!);
  }

  updateProduct(updatedProduct: IProductSchema) {
    this.items = this.items.map(item => {
      if(item._id === updatedProduct._id){
        return updatedProduct;
      }
      return item;
    });
    this.tableComponent.isEdit = false;
    this.toastService.show({ type: EToastType.SUCCESS, text: 'Producto actualizado correctamente', duration: 3000});
  }
}
