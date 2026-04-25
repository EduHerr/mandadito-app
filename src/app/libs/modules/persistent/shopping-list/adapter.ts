import { IRepository } from "@libs/modules/db/repository/adapter";
import { IShoppingListSchema } from "./schema";

export abstract class IShoppingListRepository extends IRepository<IShoppingListSchema, string>{}
