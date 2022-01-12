import { errorList } from '../../utils/errorList';
import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { RoomView } from '../../entity/RoomView';
import { RoomViewInput } from './RoomViewInputType';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class RoomViewResolver {

  @Mutation(() => RoomView)
  // @UseMiddleware(isAuth)
  async addRoomView(@Arg('data') roomViewInput: RoomViewInput): Promise<RoomView> {
    const roomview = RoomView.create(roomViewInput);
    await roomview.save();

    return roomview;
  }

  @Mutation(() => RoomView)
  // @UseMiddleware(isAuth)
  async updateRoomView(@Arg('data') roomViewInput: RoomViewInput): Promise<RoomView | undefined> {

    const exists = await RoomView.findOne(roomViewInput.roomViewId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('La vista de cuarto'));
    }

    await RoomView.update({ roomViewId: roomViewInput.roomViewId }, { ...roomViewInput });
    const roomview = await RoomView.findOne(roomViewInput.roomViewId);

    return roomview;
  }

  @Query(() => RoomView)
  // @UseMiddleware(isAuth)
  async getRoomViewById(
    @Arg('roomViewId', () => Int) roomViewId: number,
  ): Promise<RoomView | undefined> {
    const roomview = await RoomView.findOne(roomViewId);
    return roomview;
  }

  @Query(() => [RoomView])
  async getAllRoomView(): Promise<RoomView[]> {
    const roomview = await RoomView.find({
      order: { roomViewId: 'ASC' }
    });
    return roomview;
  }

  @Mutation(() => RoomView)
  // @UseMiddleware(isAuth)
  async deleteRoomView(
    @Arg('roomViewId', () => Int) roomViewId: number,
  ): Promise<RoomView | undefined> {
    const roomviewToDelete = await RoomView.findOne(roomViewId);
    await roomviewToDelete?.remove();

    return roomviewToDelete;
  }

}
