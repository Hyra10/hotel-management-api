import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Room } from "./Room";

@ObjectType()
@Index("RoomType_Abbr_key", ["abbr"], { unique: true })
@Index("RoomType_Name_key", ["name"], { unique: true })
@Index("RoomType_pkey", ["roomTypeId"], { unique: true })
@Entity("RoomType")
export class RoomType extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "RoomTypeId" })
  roomTypeId?: number;

  @Field()
  @Column("character varying", { name: "Name", unique: true, length: 50 })
  name?: string;

  @Field()
  @Column("character varying", { name: "Abbr", unique: true, length: 10 })
  abbr?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Description",
    nullable: true,
    length: 200,
  })
  description?: string | null;

  @Field(() => [Room])
  @OneToMany(() => Room, (room) => room.roomType)
  rooms?: Room[];
}
