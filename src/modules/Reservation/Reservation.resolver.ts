import { Resolver, Arg, Query, Int,
  Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { ReservationInput, UpdateReservationInput } from './ReservationInputType';
import { Reservation } from '../../entity/Reservation';
import { ReservationRoom } from '../../entity/ReservationRoom';
import { Room } from '../../entity/Room';
import { MyContext } from '../../utils/MyContext';
import { isAuth } from '../middlewares/isAuth';
import { addNewReport }  from  '../Report/report.utility';

@Resolver()
export class ReservationResolver {
  @Mutation(() => Reservation)
  @UseMiddleware(isAuth)
  async addReservation(
    @Arg('data') reservationInput: ReservationInput,
    @Ctx() { payload }: MyContext,
  ): Promise<Reservation> {
    const todaysDate = new Date();
    const userId = +payload!.userId;
    const userRoleId = payload?.userRoleId;

    const reservation = Reservation.create({
      client: { clientId: reservationInput.clientId },
      subtotal: reservationInput.subtotal,
      tax: reservationInput.tax,
      total: reservationInput.total,
      createdAt: todaysDate,
      updatedAt: todaysDate,
      reservationStatus: {
        reservationStatusId: reservationInput.reservationStatusId,
      },
    });

    await reservation.save();

    const reservationRooms = reservationInput.room.map(x => {
      const rr = new ReservationRoom();
      const r = new Room();
      r.roomId = x.roomId;

      rr.checkInDate = x.startDate;
      rr.checkOutDate = x.endDate;
      rr.reservation = reservation;
      rr.room = r;

      return rr;
    });

    await ReservationRoom.save(reservationRooms);

    if(userRoleId === 3) {
      const message = 'Agrego una Reserva Nueva Reserva';
      await addNewReport(userId, message)
    }

    return reservation;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async UpdateReservation(
    @Arg('data') {reservationId, reservationStatusId}: UpdateReservationInput,
    @Ctx() { payload }: MyContext,
  ): Promise<boolean> {
    const userId = +payload!.userId;
    const userRoleId = payload?.userRoleId;

    try{
      await Reservation.update(reservationId, {
        reservationStatus: {
          reservationStatusId
        }
      });

      if(userRoleId === 3) {
        const message = 'Actualizo una nueva Reserva';
        await addNewReport(userId, message)
      }

      return true;
    } catch {
      return false
    }

  }

  @Query(() => Reservation)
  // @UseMiddleware(isAuth)
  async getReservationById(
    @Arg('reservationId', () => Int) reservationId: number,
  ): Promise<Reservation | undefined> {
    const reservation = await Reservation.findOne(
      reservationId,
      { relations: [
        'client', 'reservationRooms', 'reservationRooms.room',
        'reservationRooms.room.roomType', 'reservationItems', 'reservationStatus',
        ]
      }
    );
    return reservation;
  }

  @Query(() => [Reservation])
  async getAllReservation(
  ): Promise<Reservation[]> {
    const reservation = await Reservation.find({
      relations: ['client', 'reservationRooms',
        'reservationItems', 'reservationStatus'],
    });

    return reservation;
  }
}
