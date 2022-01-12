import { Resolver, Arg, Query, Mutation, Int } from 'type-graphql';
import { ServiceInput } from './ServiceInputType';
import { Service } from '../../entity/Service';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class ServiceResolver {
  @Mutation(() => Service)
  // @UseMiddleware(isAuth)
  async addService(
    @Arg('data') {hotelId, ...serviceInput}: ServiceInput
  ): Promise<Service> {
    const service = Service.create({
      ...serviceInput,
      hotel: {
        hotelId
      }
    });

    await service.save();

    return service;
  }

  @Mutation(() => Service)
  // @UseMiddleware(isAuth)
  async updateService(
    @Arg('data') {hotelId, ...serviceInput}: ServiceInput
  ): Promise<Service | undefined> {

    const exists = await Service.findOne(serviceInput.serviceId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El servicio'));
    }

    await Service.update({ serviceId: serviceInput.serviceId }, {
      ...serviceInput,
      hotel: {
        hotelId
      }
    });

    const service = await Service.findOne(serviceInput.serviceId);

    return service;
  }

  @Query(() => Service)
  // @UseMiddleware(isAuth)
  async getServiceById(
    @Arg('serviceId', () => Int) serviceId: number,
  ): Promise<Service | undefined> {
    const service = await Service.findOne(serviceId);
    return service;
  }

  @Query(() => [Service])
  async getAllServices(
    @Arg('hotelId', () => Int) hotelId: number,
  ): Promise<Service[]> {
    const service = await Service.find({
      where: { hotel: { hotelId } },
      relations: ['hotel']
    });
    return service;
  }

  @Mutation(() => Service)
  // @UseMiddleware(isAuth)
  async deleteService(
    @Arg('serviceId', () => Int) serviceId: number,
  ): Promise<Service | undefined> {
    const serviceToDelete = await Service.findOne(serviceId);
    await serviceToDelete?.remove();

    return serviceToDelete;
  }
}
