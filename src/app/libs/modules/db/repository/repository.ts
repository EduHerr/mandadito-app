import { Table, UpdateSpec } from 'dexie';
import { DateTime } from "luxon";
import { IRepository } from './adapter';

export abstract class Repository<T, ID> implements IRepository<T, ID> {

  constructor(protected table: Table<T, ID>) {}

  get(): Promise<T[]> {
    return this.table.toArray();
  }

  findById(id: ID): Promise<any> {
    return this.table.get(id);
  }

  async add(item: T): Promise<T>{
    const _id = crypto.randomUUID() as ID;
    await this.table.add({
      ...item, 
      _id,
      lastUpdated: DateTime.now().toMillis()
    });
    return await this.findById(_id);
  }

  async addWithId(item: T): Promise<void> {
    await this.table.add(item);
  }

  async update(id: ID, changes: UpdateSpec<T>): Promise<T> {
    await this.table.update(id, {
      ...changes, 
      lastUpdated: DateTime.now().toMillis()
    });
    return await this.findById(id);
  }

  delete(id: ID): Promise<void> {
    return this.table.delete(id);
  }
}
