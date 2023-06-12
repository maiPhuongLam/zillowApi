import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { HomeEntity } from "./home.entity";

export enum UserType {
  BUYER = "buyer",
  REALTOR = "realtor",
  ADMIN = "admin",
}

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserType, name: "user_type" })
  userType: UserType;

  @OneToMany(() => HomeEntity, (home) => home.realtor)
  homes: HomeEntity[];

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;
}
