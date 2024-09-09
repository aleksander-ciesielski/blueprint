import {
  Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne,
} from "typeorm";
import { ProgramSnippetGroup } from "~/models/entities/ProgramSnippetGroup";

export enum ProgramSnippetType {
  Source = "SOURCE",
  Visualizer = "VISUALIZER",
  Markdown = "MARKDOWN",
}

@Entity("snippets")
export class ProgramSnippet {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: ProgramSnippetType })
  public type!: ProgramSnippetType;

  @Column()
  public contentBase64!: string;

  @ManyToOne(() => ProgramSnippetGroup, (group) => group.snippets)
  public group!: Relation<ProgramSnippetGroup>;
}
