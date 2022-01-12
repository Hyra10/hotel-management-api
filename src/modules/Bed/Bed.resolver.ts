import { UserInputError } from 'apollo-server-express';
import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { errorList } from '../../utils/errorList';
import { Bed } from '../../entity/Bed';
import { BedInput } from './BedInputType';

@Resolver()
export class BedResolver {

  @Query(() => [Bed])
  async getAllBeds(): Promise<Bed[]> {
    const beds = await Bed.find();
    return beds;
  }

  @Mutation(() => Bed)
  // @UseMiddleware(isAuth)
  async addBed(@Arg('data') bedInput: BedInput): Promise<Bed> {
    const bed = Bed.create(bedInput);
    await bed.save();

    return bed;
  }

  @Mutation(() => Bed)
  // @UseMiddleware(isAuth)
  async updateBed(@Arg('data') bedInput: BedInput): Promise<Bed | undefined> {

    const exists = await Bed.findOne(bedInput.bedId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('La cama'));
    }

    await Bed.update({ bedId: bedInput.bedId }, { ...bedInput });
    const bed = await Bed.findOne(bedInput.bedId);

    return bed;
  }

  @Query(() => Bed)
  // @UseMiddleware(isAuth)
  async getBedById(
    @Arg('bedId', () => Int) bedId: number,
  ): Promise<Bed | undefined> {
    const bed = await Bed.findOne(bedId);
    return bed;
  }

  @Mutation(() => Bed)
  // @UseMiddleware(isAuth)
  async deleteBed(
    @Arg('bedId', () => Int) bedId: number,
  ): Promise<Bed | undefined> {
    const bedToDelete = await Bed.findOne(bedId);
    await bedToDelete?.remove();

    return bedToDelete;
  }  

}
