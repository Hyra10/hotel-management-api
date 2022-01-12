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
import { User } from "./User";
import { Room } from "./Room";
import { Service } from "./Service";

@ObjectType()
@Index("Hotel_pkey", ["hotelId"], { unique: true })
@Entity("Hotel")
export class Hotel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "HotelId" })
  hotelId?: number;

  @Field()
  @Column("character varying", { name: "Name", length: 20 })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Description",
    nullable: true,
    length: 200,
  })
  description?: string | null;

  @Field(() => [Client])
  @OneToMany(() => Client, (client) => client.hotel)
  clients?: Client[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.hotels)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user?: User;

  @Field(() => [Room])
  @OneToMany(() => Room, (room) => room.hotel)
  rooms?: Room[];

  @Field(() => [Service])
  @OneToMany(() => Service, (service) => service.hotel)
  services?: Service[];

  @RelationId((hotel: Hotel) => hotel.user)
  userId?: number[];
}
