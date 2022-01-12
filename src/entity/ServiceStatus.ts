import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { ServiceReservation } from "./ServiceReservation";

@ObjectType()
@Index("ServiceStatus_Name_key", ["name"], { unique: true })
@Index("ServiceStatus_pkey", ["serviceStatusId"], { unique: true })
@Entity("ServiceStatus")
export class ServiceStatus extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ServiceStatusId" })
  serviceStatusId?: number;

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

  @Field(() => [ServiceReservation])
  @OneToMany(
    () => ServiceReservation,
    (serviceReservation) => serviceReservation.serviceStatus
  )
  serviceReservations?: ServiceReservation[];
}
