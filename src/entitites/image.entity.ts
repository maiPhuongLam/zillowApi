import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { HomeEntity } from "./home.entity";

export enum PropertyType {
  RESIDENTIAL = "residentital",
  CONDO = "condo",
}

@Entity("images")
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  url: string;

  @Column({ name: "home_id" })
  homeId: number;

  @ManyToOne(() => HomeEntity, (home) => home)
  @JoinColumn({ name: "home_id" })
  home: HomeEntity;

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;
}
