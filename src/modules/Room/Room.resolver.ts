import { Resolver, Arg, Query, Mutation, Int } from 'type-graphql';
import { Room } from '../../entity/Room';
import { RoomInput } from './RoomInputType';
import { RoomBed } from '../../entity/RoomBed';
import { Bed } from '../../entity/Bed';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';


const maptoValues = ({ hotelId, ...roomInput }: RoomInput) => ({
  ...roomInput,
  hotel: {
    hotelId
  },
  roomStatus: {
    roomStatusId: roomInput.roomStatus
  },
  roomType: {
    roomTypeId: roomInput.roomType
  },
  roomView: {
    roomViewId: roomInput.roomView
  },
});

@Resolver()
export class RoomResolver {

  @Mutation(() => Room)
  // @UseMiddleware(isAuth)
  async addRoom(@Arg('data') roomInput: RoomInput): Promise<Room> {
    const room = Room.create(maptoValues(roomInput));
    await room.save();

    const roomBeds = roomInput?.beds?.map((value: number) => {
      const newBed = new Bed();
      newBed.bedId = value;

      const newRoomBed = new RoomBed();
      newRoomBed.room = room;
      newRoomBed.bed = newBed;

      return newRoomBed
    });

    await RoomBed.save(roomBeds);

    return room;
  }

  @Mutation(() => Room)
  // @UseMiddleware(isAuth)
  async updateRoom(@Arg('data') roomInput: RoomInput): Promise<Room> {
    const exists = await Room.findOne(roomInput.roomId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El cuarto'));
    }

    const room = Room.create(maptoValues(roomInput));
    await room.save();

    //removes old beds association DONT LIKE
    const oldRoomBeds = await RoomBed.find({
      where: { room: { roomId: roomInput.roomId } },
    });

    await RoomBed.remove(oldRoomBeds);

    const roomBeds = roomInput?.beds?.map((value: number) => {
      const newBed = new Bed();
      newBed.bedId = value;

      const newRoomBed = new RoomBed();
      newRoomBed.room = room;
      newRoomBed.bed = newBed;

      return newRoomBed
    });

    await RoomBed.save(roomBeds);

    return room;
  }

  @Query(() => Room)
  // @UseMiddleware(isAuth)
  async getRoomById(
    @Arg('roomId') roomId: number,
  ): Promise<Room | undefined> {
    const room = await Room.findOne(roomId, {
      relations: ['roomView', 'roomType', 'roomBeds',
      'roomBeds.bed', 'roomStatus'],
    });
    return room;
  }

  @Query(() => [Room])
  async getAllRooms(
    @Arg('hotelId', () => Int) hotelId: number
  ): Promise<Room[]> {
    const room = await Room.find({
      where: {
        hotel: {
          hotelId
        },
      },
      relations: ['roomBeds', 'roomBeds.bed', 'roomType', 'roomStatus'],
      order: { roomNumber: 'ASC' }
    });
    return room;
  }

  @Mutation(() => Room)
  // @UseMiddleware(isAuth)
  async deleteRoom(
    @Arg('roomId', () => Int) roomId: number,
  ): Promise<Room | null> {
    try {
      const room = await Room.findOne(roomId, {
        relations: ['roomBeds', 'roomBeds.bed'],
      });

      if(!room) {
        throw new UserInputError(errorList.notFound('el cuarto'));
      }
  
      if(room.roomBeds) {
        await RoomBed.remove(room.roomBeds);
      }

      await room.remove();

      return room;
    } catch (ex) {
      console.log('err', ex)
      return null;
    }
  }
}
