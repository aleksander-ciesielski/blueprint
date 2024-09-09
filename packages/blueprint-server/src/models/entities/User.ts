import {
  Column, Entity, Index, PrimaryGeneratedColumn, OneToMany, Relation,
} from "typeorm";
import { Program } from "~/models/entities/Program";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Index({ unique: true })
  @Column()
  public email!: string;

  @Column()
  public name!: string;

  @Column()
  public password!: string;

  @OneToMany(() => Program, (program) => program.author)
  public programs!: Relation<Program[]>;
}
