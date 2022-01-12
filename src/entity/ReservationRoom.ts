import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Reservation } from "./Reservation";
import { Room } from "./Room";

@ObjectType()
@Index("ReservationRoom_pkey", ["reservationRoomId"], { unique: true })
@Entity("ReservationRoom")
export class ReservationRoom extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ReservationRoomId" })
  reservationRoomId?: number;

  @Field()
  @Column("timestamp without time zone", { name: "CheckInDate" })
  checkInDate?: Date;

  @Field()
  @Column("timestamp without time zone", { name: "CheckOutDate" })
  checkOutDate?: Date;

  @Field(() => Reservation)
  @ManyToOne(() => Reservation, (reservation) => reservation.reservationRooms)
  @JoinColumn([
    { name: "ReservationId", referencedColumnName: "reservationId" },
  ])
  reservation?: Reservation;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.reservationRooms)
  @JoinColumn([{ name: "RoomId", referencedColumnName: "roomId" }])
  room?: Room;

  @RelationId((reservationRoom: ReservationRoom) => reservationRoom.reservation)
  reservationId?: number[];

  @RelationId((reservationRoom: ReservationRoom) => reservationRoom.room)
  roomId?: number[];
}
