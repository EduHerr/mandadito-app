import { IRepository } from "@libs/modules/db/repository/adapter";
import { ISnapshotSchema } from "./schema";

export abstract class ISnapshotRepository extends IRepository<ISnapshotSchema, string>{}
