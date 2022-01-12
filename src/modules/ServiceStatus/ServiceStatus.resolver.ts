import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { ServiceStatus } from '../../entity/ServiceStatus';
import { ServiceStatusInput } from './ServiceStatusInputType';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class ServiceStatusResolver {

  @Query(() => [ServiceStatus])
  async getAllServiceStatuses(): Promise<ServiceStatus[]> {
    const serviceStatus = await ServiceStatus.find();
    return serviceStatus;
  }

  @Mutation(() => ServiceStatus)
  // @UseMiddleware(isAuth)
  async addServiceStatus(
    @Arg('data') ServiceStatusInput: ServiceStatusInput): Promise<ServiceStatus> {
    const serviceStatus = ServiceStatus.create(ServiceStatusInput);
    await serviceStatus.save();

    return serviceStatus;
  }

  @Mutation(() => ServiceStatus)
  // @UseMiddleware(isAuth)
  async updateServiceStatus(
    @Arg('data') serviceStatusInput: ServiceStatusInput): Promise<ServiceStatus | undefined> {

    const exists = await ServiceStatus.findOne(serviceStatusInput.serviceStatusId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El estado de servicio'));
    }

    await ServiceStatus.update({ 
      serviceStatusId: serviceStatusInput.serviceStatusId }, { ...serviceStatusInput });
    const serviceStatus = await ServiceStatus.findOne(serviceStatusInput.serviceStatusId);

    return serviceStatus;
  }

  @Query(() => ServiceStatus)
  // @UseMiddleware(isAuth)
  async getServiceStatusById(
    @Arg('serviceStatusId', () => Int) serviceStatusId: number,
  ): Promise<ServiceStatus | undefined> {
    const serviceStatus = await ServiceStatus.findOne(serviceStatusId);
    return serviceStatus;
  }

  @Mutation(() => ServiceStatus)
  // @UseMiddleware(isAuth)
  async deleteServiceStatus(
    @Arg('serviceStatusId', () => Int) serviceStatusId: number,
  ): Promise<ServiceStatus | undefined> {
    const serviceStatusToDelete = await ServiceStatus.findOne(serviceStatusId);
    await serviceStatusToDelete?.remove();

    return serviceStatusToDelete;
  }

}
