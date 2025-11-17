import { UpdateSpec } from 'dexie';

export abstract class IRepository<T, ID> {
    abstract get(): Promise<T[]>;
    abstract findById(id: ID): Promise<T | undefined>;
    abstract add(item: T): Promise<T>;
    abstract update(id: ID, changes: UpdateSpec<T>): Promise<T>;
    abstract delete(id: ID): Promise<void>;
}

