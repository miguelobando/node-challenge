import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class users {
  @PrimaryColumn('varchar')
  email: string;
  @Column('varchar')
  password: string;
  @Column('varchar')
  role: string;
}
