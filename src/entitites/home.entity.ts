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
import { ImageEntity } from "./image.entity";
import { UserEntity } from "./user.entity";

export enum PropertyType {
  RESIDENTIAL = "residentital",
  CONDO = "condo",
}

@Entity("homes")
export class HomeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  address: string;

  @Column({ name: "number_of_bedrooms" })
  numberOfBedrooms: number;

  @Column({ name: "number_of_bathrooms" })
  numberOfBathrooms: number;

  @Column()
  city: string;

  @Column({ name: "land_size", type: "float" })
  landSize: number;

  @Column({ type: "float" })
  price: number;

  @Column({ name: "property_type", type: "enum", enum: PropertyType })
  propertyType: PropertyType;

  @OneToMany(() => ImageEntity, (image) => image.home)
  images: ImageEntity[];

  @Column({ name: "realtor_id" })
  realtorId: number;

  @ManyToOne(() => UserEntity, (user) => user.homes)
  @JoinColumn({ name: "realtor_id" })
  realtor: UserEntity;

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;
}
