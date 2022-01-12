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

@ObjectType()
@Index("ReservationItem_pkey", ["reservationItemId"], { unique: true })
@Entity("ReservationItem")
export class ReservationItem extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ReservationItemId" })
  reservationItemId?: number;

  @Field()
  @Column("character varying", { name: "Name", length: 50 })
  name?: string;

  @Field()
  @Column("integer", { name: "Price" })
  price?: number;

  @Field()
  @Column("timestamp without time zone", { name: "CreatedAt" })
  createdAt?: Date;

  @Field(() => Reservation)
  @ManyToOne(() => Reservation, (reservation) => reservation.reservationItems)
  @JoinColumn([
    { name: "ReservationId", referencedColumnName: "reservationId" },
  ])
  reservation?: Reservation;

  @RelationId((reservationItem: ReservationItem) => reservationItem.reservation)
  reservationId?: number[];
}
