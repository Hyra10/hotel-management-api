import { errorList } from '../../utils/errorList';
import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { RoomStatus } from '../../entity/RoomStatus';
import { RoomStatusInput } from './RoomStatusInputType';
import { UserInputError } from 'apollo-server-express';


@Resolver()
export class RoomStatusResolver {

  @Query(() => [RoomStatus])
  async getAllRoomStatuses(): Promise<RoomStatus[]> {
    const roomStatus = await RoomStatus.find();
    return roomStatus;
  }

  @Mutation(() => RoomStatus)
  // @UseMiddleware(isAuth)
  async addRoomStatus(@Arg('data') RoomStatusInput: RoomStatusInput): Promise<RoomStatus> {
    const roomstatus = RoomStatus.create(RoomStatusInput);
    await roomstatus.save();

    return roomstatus;
  }

  @Mutation(() => RoomStatus)
  // @UseMiddleware(isAuth)
  async updateRoomStatus
  (@Arg('data') roomStatusInput: RoomStatusInput): Promise<RoomStatus | undefined> {

    const exists = await RoomStatus.findOne(roomStatusInput.roomStatusId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El estado de cuarto'));
    }

    await RoomStatus.update({ roomStatusId: roomStatusInput.roomStatusId }, { ...roomStatusInput });
    const roomstatus = await RoomStatus.findOne(roomStatusInput.roomStatusId);

    return roomstatus;
  }

  @Query(() => RoomStatus)
  // @UseMiddleware(isAuth)
  async getRoomStatusById(
    @Arg('roomStatusId', () => Int) roomStatusId: number,
  ): Promise<RoomStatus | undefined> {
    const roomstatus = await RoomStatus.findOne(roomStatusId);
    return roomstatus;
  }

  @Mutation(() => RoomStatus)
  // @UseMiddleware(isAuth)
  async deleteRoomStatus(
    @Arg('roomStatusId', () => Int) roomStatusId: number,
  ): Promise<RoomStatus | undefined> {
    const roomstatusToDelete = await RoomStatus.findOne(roomStatusId);
    await roomstatusToDelete?.remove();

    return roomstatusToDelete;
  }  

}
