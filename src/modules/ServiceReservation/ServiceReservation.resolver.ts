import { Resolver, Arg, Query, Mutation, Int, Ctx, UseMiddleware } from 'type-graphql';
import { ServiceReservationInput } from './ServiceReservationInputType';
import { ServiceReservation } from '../../entity/ServiceReservation';
import { ClientServiceReservation } from '../../entity/ClientServiceReservation';
import { Client } from '../../entity/Client';
import { MyContext } from '../../utils/MyContext';
import { isAuth } from '../middlewares/isAuth';
import { addNewReport } from '../Report/report.utility';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

const maptoValues = (serviceReservationInput: ServiceReservationInput): ServiceReservation => {

  return {
    ...serviceReservationInput,
    serviceStatus: {
      serviceStatusId: serviceReservationInput.serviceStatusId
    },
    service: {
      serviceId: serviceReservationInput.serviceId
    }
  } as ServiceReservation
}

@Resolver()
export class ServiceReservationResolver {
  @Mutation(() => ServiceReservation)
  @UseMiddleware(isAuth)
  async addServiceReservation(
    @Arg('data') serviceReservationInput: ServiceReservationInput,
    @Ctx() { payload }: MyContext,
  ): Promise<ServiceReservation | undefined> {
    const userId = +payload!.userId;
    const userRoleId = payload!.userRoleId;

    const service = ServiceReservation.create({
      ...maptoValues(serviceReservationInput)
    });

    await service.save();

    const newCsr = serviceReservationInput?.clientId?.map((value: number) => {
      const newClient = new Client();
      newClient.clientId = value;

      const newClientReservation = new ClientServiceReservation();
      newClientReservation.serviceReservation = service;
      newClientReservation.client = newClient;

      return newClientReservation
    });

    if(newCsr) {
      await ClientServiceReservation.save(newCsr);
    }

    if(userRoleId === 3) {
      const message = 'Agrego una nueva reservacion para un servicio'
      await addNewReport(userId, message)
    }

    return service;
  }

  @Mutation(() => ServiceReservation)
  @UseMiddleware(isAuth)
  async updateServiceReservation(
    @Arg('data') serviceReservationInput: ServiceReservationInput,
    @Ctx() { payload }: MyContext,
    ): Promise<ServiceReservation | undefined> {
    const userId = +payload!.userId;
    const userRoleId = payload!.userRoleId;

    const exists = await ServiceReservation.findOne(serviceReservationInput.serviceReservationId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('La reservacion de servicio'));
    }

    // await ServiceReservation.update(
    //   {serviceReservationId: serviceReservationInput.serviceReservationId },
    //   { ...serviceReservationInput }
    // );
  //const service = await ServiceReservation.findOne(serviceReservationInput.serviceReservationId);

    if(userRoleId === 3) {
      const message = 'Actualizo una reservacion para un servicio'
      await addNewReport(userId, message)
    }

    return exists;
  }

  @Query(() => ServiceReservation)
  // @UseMiddleware(isAuth)
  async getServiceReservationById(
    @Arg('serviceReservationId', () => Int) serviceReservationId: number,
  ): Promise<ServiceReservation | undefined> {
    const service = await ServiceReservation.findOne(serviceReservationId, {
      relations: [
        'clientServiceReservations', 'clientServiceReservations.client',
        'service', 'serviceStatus'
      ]
    });
    return service;
  }

  @Query(() => [ServiceReservation])
  async getAllServiceReservation(
    @Arg('startOfWeek', () => Date) startOfWeek: Date,
    @Arg('endOfWeek', () => Date) endOfWeek: Date,
    @Arg('hotelId', () => Int) hotelId: number
  ): Promise<ServiceReservation[]> {

    const service = ServiceReservation.createQueryBuilder('sr')
      .innerJoinAndSelect('sr.service', 'service')
      .innerJoinAndSelect('sr.serviceStatus', 'ServiceStatus')
      .innerJoinAndSelect('service.hotel', 'hotel')
      .where('hotel.hotelId = :hotelId', { hotelId })
      .andWhere(
        'sr.startDate >= :startOfWeek AND sr.startDate <= :endOfWeek',
        { startOfWeek, endOfWeek }
      )
      .getMany();
    

    return service;
  }

  @Mutation(() => ServiceReservation)
  // @UseMiddleware(isAuth)
  async deleteServiceReservation(
    @Arg('serviceReservationId', () => Int) serviceReservationId: number,
  ): Promise<ServiceReservation | undefined> {
    const serviceToDelete = await ServiceReservation.findOne(serviceReservationId);
    await serviceToDelete?.remove();

    return serviceToDelete;
  }
}
