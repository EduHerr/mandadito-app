import { Inject, Injectable } from "@angular/core";
import { PRODUCT_REPOSITORY } from "@app/app.config";
import { IProductRepository } from "@libs/modules/persistent/products/adapter";
import { IProductSchema } from "@libs/modules/persistent/products/schema";

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository
    ){}

    async add(product: IProductSchema){
        return await this.productRepository.add(product);
    }

    async addWithId(product: IProductSchema){
        return await this.productRepository.addWithId(product);
    }

    async get(){
        return await this.productRepository.get();
    }

    async findById(id: string){
        return await this.productRepository.findById(id);
    }

    async update(id: string, changes: Partial<IProductSchema>){
        return await this.productRepository.update(id, changes);
    }
    
    async delete(id: string){
        return await this.productRepository.delete(id);
    }
}
