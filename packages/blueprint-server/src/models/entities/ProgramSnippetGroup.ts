import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Relation, OneToMany,
} from "typeorm";
import { ProgramSnippet } from "~/models/entities/ProgramSnippet";
import { Program } from "~/models/entities/Program";

@Entity("snippetGroups")
export class ProgramSnippetGroup {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToMany(() => ProgramSnippet, (snippet) => snippet.group, { cascade: true })
  public snippets!: Relation<ProgramSnippet[]>;

  @ManyToOne(() => Program, (program) => program.snippetGroups)
  public program!: Relation<Program>;
}
