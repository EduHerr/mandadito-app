import { IBaseSchema } from "@libs/modules/db/schema";

export interface IProductSchema extends IBaseSchema {
    _id?: string;
    name: string;
    quantity: number;
    unit_cost: number;
    description?: string;
    totalCost?: number;
}
