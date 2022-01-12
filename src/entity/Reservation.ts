import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Client } from "./Client";
import { ReservationStatus } from "./ReservationStatus";
import { ReservationItem } from "./ReservationItem";
import { ReservationRoom } from "./ReservationRoom";

@ObjectType()
@Index("Reservation_pkey", ["reservationId"], { unique: true })
@Entity("Reservation")
export class Reservation extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ReservationId" })
  reservationId?: number;

  @Field()
  @Column("integer", { name: "Subtotal", default: () => "0" })
  subtotal?: number;

  @Field()
  @Column("integer", { name: "Tax", default: () => "0" })
  tax?: number;

  @Field()
  @Column("integer", { name: "Total", default: () => "0" })
  total?: number;

  @Field()
  @Column("timestamp without time zone", { name: "CreatedAt" })
  createdAt?: Date;

  @Field()
  @Column("timestamp without time zone", { name: "UpdatedAt" })
  updatedAt?: Date;

  @Field(() => Client)
  @ManyToOne(() => Client, (client) => client.reservations)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client?: Client;

  @Field(() => ReservationStatus)
  @ManyToOne(
    () => ReservationStatus,
    (reservationStatus) => reservationStatus.reservations
  )
  @JoinColumn([
    {
      name: "ReservationStatusId",
      referencedColumnName: "reservationStatusId",
    },
  ])
  reservationStatus?: ReservationStatus;

  @Field(() => [ReservationItem])
  @OneToMany(
    () => ReservationItem,
    (reservationItem) => reservationItem.reservation
  )
  reservationItems?: ReservationItem[];

  @Field(() => [ReservationRoom])
  @OneToMany(
    () => ReservationRoom,
    (reservationRoom) => reservationRoom.reservation
  )
  reservationRooms?: ReservationRoom[];

  @RelationId((reservation: Reservation) => reservation.client)
  clientId?: number[];

  @RelationId((reservation: Reservation) => reservation.reservationStatus)
  reservationStatusId?: number[];
}
