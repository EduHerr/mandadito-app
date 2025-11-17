import { IRepository } from "@libs/modules/db/repository/adapter";
import { IProductSchema } from "./schema";

export abstract class IProductRepository extends IRepository<IProductSchema, string>{}
