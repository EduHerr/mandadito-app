import { IBaseSchema } from "@libs/modules/db/schema";
import { IProductSchema } from "../products/schema";

export interface IShoppingListSchema extends IBaseSchema {
    alias?: string;
    products: IProductSchema[];
}
