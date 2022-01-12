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
@Index("RoomView_Name_key", ["name"], { unique: true })
@Index("RoomView_pkey", ["roomViewId"], { unique: true })
@Entity("RoomView")
export class RoomView extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "RoomViewId" })
  roomViewId?: number;

  @Field()
  @Column("character varying", { name: "Name", unique: true, length: 50 })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "Abbr", nullable: true, length: 10 })
  abbr?: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Description",
    nullable: true,
    length: 200,
  })
  description?: string | null;

  @Field(() => [Room])
  @OneToMany(() => Room, (room) => room.roomView)
  rooms?: Room[];
}
