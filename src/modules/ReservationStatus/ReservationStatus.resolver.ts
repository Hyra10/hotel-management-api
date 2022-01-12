import { errorList } from '../../utils/errorList';
import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { ReservationStatus } from '../../entity/ReservationStatus';
import { ReservationStatusInput } from './ReservationStatusInputType';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class ReservationStatusResolver {

  @Query(() => [ReservationStatus])
  async getAllReservationStatuses(): Promise<ReservationStatus[]> {
    const reservationStatuses = await ReservationStatus.find();
    return reservationStatuses;
  }

  @Mutation(() => ReservationStatus)
  // @UseMiddleware(isAuth)
  async addReservationStatus(
    @Arg('data') reservationStatusInput: ReservationStatusInput
  ): Promise<ReservationStatus> {
    const resevationStatus = ReservationStatus.create(reservationStatusInput);
    await resevationStatus.save();

    return resevationStatus;
  }

  @Mutation(() => ReservationStatus)
  // @UseMiddleware(isAuth)
  async updateReservationStatus( @Arg('data') 
  reservationStatusInput: ReservationStatusInput): Promise<ReservationStatus | undefined> {

    const exists = await ReservationStatus.findOne(reservationStatusInput.reservationStatusId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El estado de reservacion'));
    }

    await ReservationStatus.update({ reservationStatusId:
       reservationStatusInput.reservationStatusId }, { ...reservationStatusInput });
    const resevationStatus = await ReservationStatus.findOne(
      reservationStatusInput.reservationStatusId);

    return resevationStatus;
  }

  @Query(() => ReservationStatus)
  // @UseMiddleware(isAuth)
  async getReservationStatusById(
    @Arg('reservationStatusId', () => Int) reservationStatusId: number,
  ): Promise<ReservationStatus | undefined> {
    const resevationStatus = await ReservationStatus.findOne(reservationStatusId);
    return resevationStatus;
  }

  @Mutation(() => ReservationStatus)
  // @UseMiddleware(isAuth)
  async deleteReservationStatus(
    @Arg('reservationStatusId', () => Int) reservationStatusId: number,
  ): Promise<ReservationStatus | undefined> {
    const resevationStatusToDelete = await ReservationStatus.findOne(reservationStatusId);
    await resevationStatusToDelete?.remove();

    return resevationStatusToDelete;
  }
  
}
