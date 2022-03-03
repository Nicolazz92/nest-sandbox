import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class DraftEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'jsonb', nullable: false })
  draftData: string;

  @Column({ nullable: false })
  asGuid?: string;

  @VersionColumn({ nullable: false })
  version: number;

  @Column({ nullable: false })
  user: string;

  @Column({ type: 'datetime', nullable: false })
  date: Date;
}
