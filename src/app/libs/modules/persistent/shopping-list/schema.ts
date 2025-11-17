import { IBaseSchema } from "@libs/modules/db/schema";

export interface IShoppingListSchema extends IBaseSchema {
    alias?: string;
    products: string[];
}
