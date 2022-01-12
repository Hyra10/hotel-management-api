import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Max } from "class-validator";
import { RoomBed } from "./RoomBed";

@ObjectType()
@Index("Bed_pkey", ["bedId"], { unique: true })
@Index("Bed_Name_key", ["name"], { unique: true })
@Entity("Bed")
export class Bed extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "BedId" })
  bedId?: number;

  @Field()
  @Column("character varying", { name: "Name", unique: true, length: 50 })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "Abbr", nullable: true, length: 10 })
  abbr?: string | null;

  @Field(() => String, { nullable: true })
  @Max(200)
  @Column("character varying", {
    name: "Description",
    nullable: true,
    length: 200,
  })
  description?: string | null;
  
  @Field(() => [RoomBed])
  @OneToMany(() => RoomBed, (roomBed) => roomBed.bed)
  roomBeds?: RoomBed[];
}
