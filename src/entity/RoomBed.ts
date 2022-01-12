import {
  BaseEntity,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Bed } from "./Bed";
import { Room } from "./Room";

@ObjectType()
@Index("RoomBed_pkey", ["roomBedId"], { unique: true })
@Entity("RoomBed")
export class RoomBed extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "RoomBedId" })
  roomBedId?: number;

  @Field(() => Bed)
  @ManyToOne(() => Bed, (bed) => bed.roomBeds)
  @JoinColumn([{ name: "BedId", referencedColumnName: "bedId" }])
  bed?: Bed;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.roomBeds)
  @JoinColumn([{ name: "RoomId", referencedColumnName: "roomId" }])
  room?: Room;

  @RelationId((roomBed: RoomBed) => roomBed.bed)
  bedId?: number[];

  @RelationId((roomBed: RoomBed) => roomBed.room)
  roomId?: number[];
}
