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
import { ClientServiceReservation } from "./ClientServiceReservation";
import { Service } from "./Service";
import { ServiceStatus } from "./ServiceStatus";

@ObjectType()
@Index("ServiceReservation_pkey", ["serviceReservationId"], { unique: true })
@Entity("ServiceReservation")
export class ServiceReservation extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ServiceReservationId" })
  serviceReservationId?: number;

  @Field()
  @Column("timestamp without time zone", { name: "StartDate" })
  startDate?: Date;

  @Field()
  @Column("timestamp without time zone", { name: "EndDate" })
  endDate?: Date;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "ServiceSubtype",
    nullable: true,
    length: 20,
  })
  serviceSubtype?: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "ClientNotes",
    nullable: true,
    length: 150,
  })
  clientNotes?: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "StaffNotes",
    nullable: true,
    length: 150,
  })
  staffNotes?: string | null;

  @Field()
  @Column("boolean", { name: "AreThereChildren", default: () => "false" })
  areThereChildren?: boolean;

  @Field(() => [ClientServiceReservation])
  @OneToMany(
    () => ClientServiceReservation,
    (clientServiceReservation) => clientServiceReservation.serviceReservation
  )
  clientServiceReservations?: ClientServiceReservation[];

  @Field(() => Service)
  @ManyToOne(() => Service, (service) => service.serviceReservations)
  @JoinColumn([{ name: "ServiceId", referencedColumnName: "serviceId" }])
  service?: Service;

  @Field(() => ServiceStatus)
  @ManyToOne(
    () => ServiceStatus,
    (serviceStatus) => serviceStatus.serviceReservations
  )
  @JoinColumn([
    { name: "ServiceStatusId", referencedColumnName: "serviceStatusId" },
  ])
  serviceStatus?: ServiceStatus;

  @RelationId(
    (serviceReservation: ServiceReservation) => serviceReservation.service
  )
  serviceId?: number[];

  @RelationId(
    (serviceReservation: ServiceReservation) => serviceReservation.serviceStatus
  )
  serviceStatusId?: number[];
}
