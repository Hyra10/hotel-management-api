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
import { Client } from "./Client";
import { ServiceReservation } from "./ServiceReservation";

@ObjectType()
@Index("ClientServiceReservation_pkey", ["clientServiceReservationId"], {
  unique: true,
})
@Entity("ClientServiceReservation")
export class ClientServiceReservation extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "ClientServiceReservationId",
  })
  clientServiceReservationId?: number;

  @Field(() => Client)
  @ManyToOne(() => Client, (client) => client.clientServiceReservations)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client?: Client;

  @Field(() => ServiceReservation)
  @ManyToOne(
    () => ServiceReservation,
    (serviceReservation) => serviceReservation.clientServiceReservations
  )
  @JoinColumn([
    {
      name: "ServiceReservationId",
      referencedColumnName: "serviceReservationId",
    },
  ])
  serviceReservation?: ServiceReservation;

  @RelationId(
    (clientServiceReservation: ClientServiceReservation) =>
      clientServiceReservation.client
  )
  clientId?: number[];

  @RelationId(
    (clientServiceReservation: ClientServiceReservation) =>
      clientServiceReservation.serviceReservation
  )
  serviceReservationId?: number[];
}
