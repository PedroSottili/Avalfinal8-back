import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { v4 as uuid } from "uuid";
import { RecadoEntity } from "./recado.entity";

interface Interface{
  uid?:string,
  username:string,
  password:string
}

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid?: string;

  @Column()
  username?: string;

  @Column()
  password?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: Date;

  @OneToMany(() => RecadoEntity, recado => recado.user)
  recados?: RecadoEntity[];

  constructor(prop:Interface) {
    super();
    Object.assign(this,prop);
}

  @BeforeInsert()
  private beforeInsert = async () => {
    this.uid = uuid();
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  };

  @BeforeUpdate()
  private beforeUpdate = async () => {
    this.updatedAt = new Date(Date.now());
  };
}


