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
@Index("RoomStatus_Abbr_key", ["abbr"], { unique: true })
@Index("RoomStatus_Name_key", ["name"], { unique: true })
@Index("RoomStatus_pkey", ["roomStatusId"], { unique: true })
@Entity("RoomStatus")
export class RoomStatus extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "RoomStatusId" })
  roomStatusId?: number;

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

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "Color", nullable: true, length: 10 })
  color?: string | null;

  @Field(() => [Room])
  @OneToMany(() => Room, (room) => room.roomStatus)
  rooms?: Room[];
}
