import { errorList } from '../../utils/errorList';
import { Resolver, Arg, Query, Mutation, Int } from 'type-graphql';
import { RoomType } from '../../entity/RoomType';
import { RoomTypeInput } from './RoomTypeInputType';
import { UserInputError } from 'apollo-server-express';


@Resolver()
export class RoomTypeResolver {

  @Query(() => [RoomType])
  async getAllRoomTypes(): Promise<RoomType[]> {
    const roomTypes = await RoomType.find({
      order: { roomTypeId: 'ASC' }
    });
    return roomTypes;
  }

  @Mutation(() => RoomType)
  // @UseMiddleware(isAuth)
  async addRoomType(
    @Arg('data') roomTypeInput: RoomTypeInput
  ): Promise<RoomType> {
    const roomtype = RoomType.create(roomTypeInput);
    await roomtype.save();

    return roomtype;
  }

  @Mutation(() => RoomType)
  // @UseMiddleware(isAuth)
  async updateRoomType(@Arg('data') roomTypeInput: RoomTypeInput): Promise<RoomType | undefined> {

    const exists = await RoomType.findOne(roomTypeInput.roomTypeId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El tipo de cuarto'));
    }

    await RoomType.update({ roomTypeId: roomTypeInput.roomTypeId }, { ...roomTypeInput });
    const roomtype = await RoomType.findOne(roomTypeInput.roomTypeId);

    return roomtype;
  }

  @Query(() => RoomType)
  // @UseMiddleware(isAuth)
  async getRoomTypeById(
    @Arg('roomTypeId', () => Int) roomTypeId: number,
  ): Promise<RoomType | undefined> {
    const roomtype = await RoomType.findOne(roomTypeId);
    return roomtype;
  }

  @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  async deleteRoomType(
    @Arg('roomTypeId', () => Int) roomTypeId: number,
  ): Promise<boolean> {
    const roomtypeToDelete = await RoomType.findOne(roomTypeId);
    await roomtypeToDelete?.remove();

    return true;
  }  

}
