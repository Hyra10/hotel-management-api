import { Resolver, Arg, Query, Int, Mutation } from 'type-graphql';
import { ReservationItem } from '../../entity/ReservationItem';
import { Reservation } from '../../entity/Reservation';
import { ReservationItemInput } from './ReservationItemInputType';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

// import { Reservation } from '../../entity/Reservation';

const g = (reservationItemInput: ReservationItemInput) => {
  const createdAt  = new Date();
  const reservation = new Reservation();

  reservation.reservationId = reservationItemInput.reservationId;

  return {
    reservationItemId: reservationItemInput.reservationItemId,
    name: reservationItemInput.name,
    price: reservationItemInput.price,
    createdAt,
    reservation
  }
}

@Resolver()
export class ReservationItemResolver {

  @Mutation(() => ReservationItem)
  // @UseMiddleware(isAuth)
  async addReservationItem(
    @Arg('data') reservationItem: ReservationItemInput
  ): Promise<ReservationItem> {
  
    const modified = g(reservationItem)

    const ri = ReservationItem.create(modified);
    await ri.save();

    return ri;
  }

  @Mutation(() => ReservationItem)
  // @UseMiddleware(isAuth)
  async updateReservationItem(
    @Arg('data') reservationItem: ReservationItemInput
  ): Promise<ReservationItem | undefined> {

    const exists = await ReservationItem.findOne(reservationItem.reservationItemId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El Item de la rerservacion'));
    }

    const modified = g(reservationItem)

    await ReservationItem.update(
      { reservationItemId: reservationItem.reservationItemId }, { ...modified }
    );

    const service = await ReservationItem.findOne(reservationItem.reservationItemId);

    return service;
  }

  @Query(() => ReservationItem)
  // @UseMiddleware(isAuth)
  async getReservationItemById(
    @Arg('reservationItemId', () => Int) reservationItemId: number,
  ): Promise<ReservationItem | undefined> {
    const reservation = await ReservationItem.findOne(reservationItemId);
    return reservation;
  }

  @Query(() => [ReservationItem])
  async getAllReservationItems(
    @Arg('reservationId', () => Int) reservationId: number,
  ): Promise<ReservationItem[]> {
    const reservation = await ReservationItem.find({
      where: { reservationId },
      // relations: ['service', 'serviceStatus'],
    });

    return reservation;
  }

}
