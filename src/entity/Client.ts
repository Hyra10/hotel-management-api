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
import { Max, Min } from "class-validator";
import { Hotel } from "./Hotel";
import { ClientServiceReservation } from "./ClientServiceReservation";
import { Reservation } from "./Reservation";

@ObjectType()
@Index("Client_Cedula_key", ["cedula"], { unique: true })
@Index("Client_pkey", ["clientId"], { unique: true })
@Entity("Client")
export class Client extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ClientId" })
  clientId?: number;

  @Field()
  @Column("character varying", { name: "Name", length: 50 })
  name?: string;

  @Field()
  @Column("character varying", { name: "FirstSurname", length: 50 })
  firstSurname?: string;

  @Field()
  @Column("character varying", { name: "SecondSurname", length: 50 })
  secondSurname?: string;

  @Field()
  @Column("character varying", { name: "Cedula", unique: true, length: 20 })
  cedula?: string;

  @Field()
  @Max(100)
  @Min(0)
  @Column("integer", { name: "Age" })
  age?: number;

  @Field()
  @Column("character varying", { name: "PhoneNumber", length: 10 })
  phoneNumber?: string;

  @Field()
  @Column("character varying", { name: "Nationality", length: 30 })
  nationality?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "Observation", nullable: true, length: 150 })
  observation?: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Disability",
    nullable: true,
    length: 150,
  })
  disability?: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "Alergic", nullable: true, length: 150 })
  alergic?: string | null;

  @Field()
  @Column("boolean", { name: "IsLactoseIntolerant", default: () => "false" })
  isLactoseIntolerant?: boolean;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "CreditCardNumber",
    nullable: true,
    length: 50,
  })
  creditCardNumber?: string | null;

  @Field(() => String, { nullable: true })
  @Max(4, { message: 'cvc cannot be more than 4 sssssss'})
  @Column("character varying", { name: "Cvc", nullable: true, length: 4 })
  cvc?: string | null;

  @Field(() => String, { nullable: true })
  @Column("timestamp without time zone", {
    name: "ExpiredDate",
    nullable: true,
  })
  expiredDate?: Date | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "CardName",
    nullable: true,
    length: 150,
  })
  cardName?: string | null;

  @Field(() => Hotel)
  @ManyToOne(() => Hotel, (hotel) => hotel.clients)
  @JoinColumn([{ name: "HotelId", referencedColumnName: "hotelId" }])
  hotel?: Hotel;

  @Field(() => [ClientServiceReservation])
  @OneToMany(
    () => ClientServiceReservation,
    (clientServiceReservation) => clientServiceReservation.client
  )
  clientServiceReservations?: ClientServiceReservation[];

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations?: Reservation[];

  @RelationId((client: Client) => client.hotel)
  hotelId?: number[];
}
