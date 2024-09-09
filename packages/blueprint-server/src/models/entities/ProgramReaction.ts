import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation,
} from "typeorm";
import { Program } from "~/models/entities/Program";

export enum ProgramReactionType {
  Positive = "POSITIVE",
  Negative = "NEGATIVE",
}

@Entity("reactions")
export class ProgramReaction {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: ProgramReactionType })
  public type!: ProgramReactionType;

  @Column()
  public userId!: string;

  @ManyToOne(() => Program, (program) => program.reactions)
  public program!: Relation<Program>;
}
