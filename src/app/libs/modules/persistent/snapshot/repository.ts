import { db } from "@libs/modules/db/db";
import { Repository } from "@libs/modules/db/repository/repository";
import { ISnapshotSchema } from "./schema";
import { ISnapshotRepository } from "./adapter";

export class SnapshotRepository extends Repository<ISnapshotSchema, string> implements ISnapshotRepository {
  constructor() {
    super(db.snapshots);
  }
}

export const snapshotRepository = new SnapshotRepository();