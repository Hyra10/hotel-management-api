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
import { Hotel } from "./Hotel";
import { ServiceReservation } from "./ServiceReservation";

@ObjectType()
@Index("Service_pkey", ["serviceId"], { unique: true })
@Entity("Service")
export class Service extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ServiceId" })
  serviceId?: number;

  @Field()
  @Column("character varying", { name: "Name", length: 50 })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Observation",
    nullable: true,
    length: 200,
  })
  observation?: string | null;

  @Field(() => Hotel)
  @ManyToOne(() => Hotel, (hotel) => hotel.services)
  @JoinColumn([{ name: "HotelId", referencedColumnName: "hotelId" }])
  hotel?: Hotel;

  @Field(() => [ServiceReservation])
  @OneToMany(
    () => ServiceReservation,
    (serviceReservation) => serviceReservation.service
  )
  serviceReservations?: ServiceReservation[];

  @RelationId((service: Service) => service.hotel)
  hotelId?: number[];
}
