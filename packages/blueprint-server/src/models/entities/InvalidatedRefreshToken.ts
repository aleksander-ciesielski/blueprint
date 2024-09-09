import {
  CreateDateColumn, Entity, Index, PrimaryColumn,
} from "typeorm";

@Entity()
export class InvalidatedRefreshToken {
  @Index({ unique: true })
  @PrimaryColumn()
  public readonly jti!: string;

  @CreateDateColumn()
  public readonly expires!: Date;
}
