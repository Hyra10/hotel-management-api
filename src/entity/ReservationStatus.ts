import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Reservation } from "./Reservation";

@ObjectType()
@Index("ReservationStatus_Name_key", ["name"], { unique: true })
@Index("ReservationStatus_pkey", ["reservationStatusId"], { unique: true })
@Entity("ReservationStatus")
export class ReservationStatus extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ReservationStatusId" })
  reservationStatusId?: number;

  @Field()
  @Column("character varying", { name: "Name", unique: true, length: 20 })
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

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.reservationStatus)
  reservations?: Reservation[];
}
