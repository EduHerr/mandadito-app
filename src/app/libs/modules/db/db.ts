import Dexie, { Table } from "dexie";
import { IProductSchema } from "@libs/modules/persistent/products/schema";
import { IShoppingListSchema } from "@libs/modules/persistent/shopping-list/schema";
import { ISnapshotSchema } from "../persistent/snapshot/schema";

class AppDB extends Dexie {
  shoppingList!: Table<IShoppingListSchema, string>;
  products!: Table<IProductSchema, string>;
  snapshots!: Table<ISnapshotSchema, string>;

  constructor() {
    super('MandadoDB');

    this.version(1).stores({
      shoppingList: '_id, alias, products',
      products: '_id, name, quantity, price, totalCost',
      snapshots: '_id, key'
    });
  }
}

export const db = new AppDB();
