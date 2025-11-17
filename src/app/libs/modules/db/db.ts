import Dexie, { Table } from "dexie";
import { IProductSchema } from "@libs/modules/persistent/products/schema";
import { IShoppingListSchema } from "@libs/modules/persistent/shopping-list/schema";

class AppDB extends Dexie {
  shoppingList!: Table<IShoppingListSchema, string>;
  products!: Table<IProductSchema, string>;

  constructor() {
    super('MandadoDB');

    this.version(1).stores({
      shoppingList: '_id, alias',
      products: '_id, name, quantity, price, totalCost',
    });
  }
}

export const db = new AppDB();
