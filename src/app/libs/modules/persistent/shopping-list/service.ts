import { Inject, Injectable } from "@angular/core";
import { IShoppingListSchema } from "./schema";
import { SHOPPING_LIST_REPOSITORY } from "@app/app.config";
import { IShoppingListRepository } from "./adapter";

@Injectable()
export class ShoppingListaService {
    constructor(
        @Inject(SHOPPING_LIST_REPOSITORY)
        private readonly shoppinListRepository: IShoppingListRepository
    ){}

    async add(shoppingList: IShoppingListSchema){
        return await this.shoppinListRepository.add(shoppingList);
    }

    async get(){
        return await this.shoppinListRepository.get();
    }

    async findById(id: string){
        return await this.shoppinListRepository.findById(id);
    }

    async update(id: string, changes: Partial<IShoppingListSchema>){
        return await this.shoppinListRepository.update(id, changes);
    }
    
    async delete(id: string){
        return await this.shoppinListRepository.delete(id);
    }
}
