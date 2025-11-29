import { Inject, Injectable } from "@angular/core";
import { ISnapshotRepository } from "./adapter";
import { ISnapshotSchema } from "./schema";
import { SNAPSHOT_REPOSITORY } from "@app/app.config";

@Injectable()
export class SnapshotService {
  constructor(
    @Inject(SNAPSHOT_REPOSITORY)
    private readonly snapshotRepository: ISnapshotRepository
  ) {}

  async add(snapshot: ISnapshotSchema) {
    return await this.snapshotRepository.add(snapshot);
  }

  async get() {
    return await this.snapshotRepository.get();
  }

  private getInstance(){
    
  }
}
