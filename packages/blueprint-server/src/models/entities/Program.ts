import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Relation,
} from "typeorm";
import { User } from "~/models/entities/User";
import { ProgramReaction } from "~/models/entities/ProgramReaction";
import { ProgramSnippetGroup } from "~/models/entities/ProgramSnippetGroup";

@Entity("programs")
export class Program {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @ManyToOne(() => User, (user) => user.programs)
  public author!: Relation<User>;

  @OneToMany(() => ProgramReaction, (reaction) => reaction.program)
  public reactions!: Relation<ProgramReaction[]>;

  @OneToMany(() => ProgramSnippetGroup, (group) => group.program, { cascade: true })
  public snippetGroups!: Relation<ProgramSnippetGroup[]>;
}
