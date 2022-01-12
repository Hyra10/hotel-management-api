import { Resolver, Arg, Query, Int } from 'type-graphql';

import { ReservationRoom } from '../../entity/ReservationRoom';
@Resolver()
export class ReservationRoomResolver {

  @Query(() => [ReservationRoom])
  async getAllReservationRooms(
    @Arg('startDate', () => Date) startDate: Date,
    @Arg('endDate', () => Date) endDate: Date,
    @Arg('hotelId', () => Int) hotelId: number
  ): Promise<ReservationRoom[]> {

    const reservationRoom = ReservationRoom.createQueryBuilder('rr')
    .innerJoinAndSelect('rr.reservation', 'reservation')
    .innerJoinAndSelect('reservation.reservationStatus', 'reservationStatus')
    .innerJoinAndSelect('rr.room', 'room')
    .innerJoin('reservation.client', 'client')
    .innerJoin('client.hotel', 'hotel')
    .where('hotel.hotelId = :hotelId', { hotelId })
    .andWhere(
      'rr.checkInDate >= :startDate AND rr.checkOutDate <= :endDate',
      { startDate, endDate }
    )
    .getMany();

    return reservationRoom;
  }


}
