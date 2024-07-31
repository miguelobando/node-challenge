import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class stats {
  @PrimaryColumn('varchar')
  stock: string;
  @Column('int4')
  times_requested: number;
}
