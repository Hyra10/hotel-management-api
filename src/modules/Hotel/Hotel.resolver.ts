import { errorList } from '../../utils/errorList';
import { MyContext } from '../../utils/MyContext';
import { Resolver, Query, Mutation, Arg, Int, UseMiddleware, Ctx } from 'type-graphql';
import { Hotel } from '../../entity/Hotel';
import { isAuth } from '../middlewares/isAuth';
import { HotelInput } from './HotelInputType';
import { UserInputError } from 'apollo-server-express';

const mapRawQueryToHotels = (rawQuery: any): Hotel[] => {
  const users = rawQuery.map((x: any) => {
    const h = new Hotel()
    h.hotelId = x.HotelId;
    h.name = x.Name;
    h.description = x.Description;

    return h
  });

  return users;
}

@Resolver()
export class HotelResolver {

  @Query(() => [Hotel])
  @UseMiddleware(isAuth)
  async getAllHotels(
    @Ctx() { payload }: MyContext,
  ): Promise<Hotel[]> {
    const userId = payload!.userId;
    const userRoleId = payload!.userRoleId;

    let hotels: Hotel[] = [];
    if(userRoleId === 2) {
      hotels = await Hotel.find({
        where: { user: { userId } },
        relations: ['user']
      });
    } else {
      const rawQuery = await Hotel.query(`
        SELECT "h".* FROM "Hotel" AS "h"
        INNER JOIN "ProfessorStudent" AS "ps" ON "ps"."ProfesorId" = "h"."UserId"
        WHERE "ps"."StudentId" = ${userId}`
      ) || [];

      hotels = mapRawQueryToHotels(rawQuery)
    }

    return hotels;
  }

  @Mutation(() => Hotel)
  @UseMiddleware(isAuth)
  async addHotel(
    @Arg('data') hotelInput: HotelInput,
    @Ctx() { payload }: MyContext,
  ): Promise<Hotel> {
    const userId = +payload!.userId;

    const hotelExists = await Hotel.findOne({
      where: {
        name: hotelInput.name,
        user: { userId }
      }
    });

    if(hotelExists) {
      throw new UserInputError(errorList.alreadyExists('El hotel con ese nombre'))
    }

    const hotel = Hotel.create({
      ...hotelInput,
      user: { userId }
    });
    await hotel.save();

    return hotel;
  }

  @Mutation(() => Hotel)
  // @UseMiddleware(isAuth)
  async updateHotel( @Arg('data') hotelInput: HotelInput): Promise<Hotel | undefined> {

    const exists = await Hotel.findOne(hotelInput.hotelId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El hotel'));
    }

    await Hotel.update({ hotelId:
      hotelInput.hotelId }, { ...hotelInput });
    const hotel = await Hotel.findOne(
      hotelInput.hotelId);

    return hotel;
  }

  @Query(() => Hotel)
  // @UseMiddleware(isAuth)
  async getHotelById(
    @Arg('hotelId', () => Int) hotelId: number,
  ): Promise<Hotel | undefined> {
    const hotel = await Hotel.findOne(hotelId);
    return hotel;
  }

  @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  async deleteHotel(
    @Arg('hotelId', () => Int) hotelId: number,
  ): Promise<boolean> {
    const hotelToDelete = await Hotel.findOne(hotelId);
    await hotelToDelete?.remove();

    return true;
  }
  
}
