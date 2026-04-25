import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ShoppingListView implements OnInit {
  @ViewChild(FormShoppingList) formComponent!: FormShoppingList;
  @ViewChild(TableShoppingList) tableComponent!: TableShoppingList;

  items: IProductSchema[] = [];
  id: string | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly shoppinListService: ShoppingListaService,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
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
        this.items = shoppinList.products;
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
    this.items.unshift(item);
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
    this.items = this.items.map((item) => {
      if (item._id === updatedProduct._id) {
        return updatedProduct;
      }
      return item;
    });
    this.tableComponent.isEdit = false;
    this.toastService.show({
      type: EToastType.SUCCESS,
      text: 'Producto actualizado',
      duration: 3000,
    });
  }
}
