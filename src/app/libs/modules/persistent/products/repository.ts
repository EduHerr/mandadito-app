import { db } from "@libs/modules/db/db";
import { Repository } from "@libs/modules/db/repository/repository";
import { IProductSchema } from "./schema";
import { IProductRepository } from "./adapter";

export class ProductRepository extends Repository<IProductSchema, string> implements IProductRepository {
  constructor() {
    super(db.products);
  }
}

export const productRepository = new ProductRepository();