import { db } from "@libs/modules/db/db";
import { Repository } from "@libs/modules/db/repository/repository";
import { IShoppingListSchema } from "./schema";
import { IShoppingListRepository } from "./adapter";

export class ShoppinListRepository extends Repository<IShoppingListSchema, string> implements IShoppingListRepository {
  constructor() {
    super(db.shoppingList);
  }
}

export const shoppingListRepository = new ShoppinListRepository();
