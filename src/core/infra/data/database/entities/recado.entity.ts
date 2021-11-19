import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { v4 as uuid } from "uuid";
import { UserEntity } from "./user.entity";

@Entity({ name: "recados" })
export class RecadoEntity extends BaseEntity {
  @PrimaryColumn()
  uid?: string;

  @Column({ length: "50" })
  descricao: string;

  @Column({ type: "text" })
  detalhamento: string;

  @Column({ name: "user_uid" })
  usersUID: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: Date;

  constructor(
    uid: string,
    descricao: string,
    detalhamento: string,
    usersUID: string,
    createdAt?: Date,
    updatedAt?: Date
) {
    super();
    this.uid = uid;
    this.descricao = descricao;
    this.detalhamento = detalhamento;
    this.usersUID=usersUID
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
}

  @ManyToOne(() => UserEntity, user => user.recados)
  @JoinColumn({ name: "user_uid", referencedColumnName: "uid" })
  user!: UserEntity;

  @BeforeInsert()
  private beforeInsert = () => {
    this.uid = uuid();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  };

  @BeforeUpdate()
  private beforeUpdate = () => {
    this.updatedAt = new Date(Date.now());
  };
}


