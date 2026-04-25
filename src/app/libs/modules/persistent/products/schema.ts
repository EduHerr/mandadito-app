import { IBaseSchema } from "@libs/modules/db/schema";

export interface IProductSchema extends IBaseSchema {
    name: string;
    quantity: number;
    unit_cost: number;
    description?: string;
    totalCost?: number;
    isPromo?: boolean;
}
