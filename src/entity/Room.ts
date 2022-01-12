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
import { ReservationRoom } from "./ReservationRoom";
import { Hotel } from "./Hotel";
import { RoomStatus } from "./RoomStatus";
import { RoomType } from "./RoomType";
import { RoomView } from "./RoomView";
import { RoomBed } from "./RoomBed";

@ObjectType()
@Index("Room_pkey", ["roomId"], { unique: true })
@Entity("Room")
export class Room extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "RoomId" })
  roomId?: number;

  @Field()
  @Column("integer", { name: "RoomNumber" })
  roomNumber?: number;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "FloorNumber", nullable: true })
  floorNumber?: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "BuildingNumber", nullable: true })
  buildingNumber?: number | null;

  @Field()
  @Column("integer", { name: "Price" })
  price?: number;

  @Field()
  @Column("boolean", { name: "AllowHandicap", default: () => "false" })
  allowHandicap?: boolean;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "Observation",
    nullable: true,
    length: 200,
  })
  observation?: string | null;

  @Field(() => [ReservationRoom])
  @OneToMany(() => ReservationRoom, (reservationRoom) => reservationRoom.room)
  reservationRooms?: ReservationRoom[];

  @Field(() => Hotel)
  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn([{ name: "HotelId", referencedColumnName: "hotelId" }])
  hotel?: Hotel;

  @Field(() => RoomStatus)
  @ManyToOne(() => RoomStatus, (roomStatus) => roomStatus.rooms)
  @JoinColumn([{ name: "RoomStatusId", referencedColumnName: "roomStatusId" }])
  roomStatus?: RoomStatus;

  @Field(() => RoomType)
  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn([{ name: "RoomTypeId", referencedColumnName: "roomTypeId" }])
  roomType?: RoomType;

  @Field(() => RoomView)
  @ManyToOne(() => RoomView, (roomView) => roomView.rooms)
  @JoinColumn([{ name: "RoomViewId", referencedColumnName: "roomViewId" }])
  roomView?: RoomView;

  @Field(() => [RoomBed])
  @OneToMany(() => RoomBed, (roomBed) => roomBed.room)
  roomBeds?: RoomBed[];

  @RelationId((room: Room) => room.hotel)
  hotelId?: number[];

  @RelationId((room: Room) => room.roomStatus)
  roomStatusId?: number[];

  @RelationId((room: Room) => room.roomType)
  roomTypeId?: number[];

  @RelationId((room: Room) => room.roomView)
  roomViewId?: number[];
}
