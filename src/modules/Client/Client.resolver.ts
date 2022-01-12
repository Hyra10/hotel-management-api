import { UserInputError } from 'apollo-server-express';
import { Resolver, Mutation, Arg,
  Query, Int, UseMiddleware, Ctx } from 'type-graphql';
import { Like } from 'typeorm';
import { Client } from '../../entity/Client';
import { ClientInput } from './ClientInputType';
import { addNewReport, clientMessage }  from  '../Report/report.utility';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../../utils/MyContext';
import { errorList } from '../../utils/errorList';

const clientInputMapped = ({ hotelId, ...clientInput}: ClientInput) => ({
  ...clientInput,
  hotel: {
    hotelId
  }
})

@Resolver()
export class ClientResolver {

  @Mutation(() => Client)
  @UseMiddleware(isAuth)
  async addClient(
    @Arg('data') clientInput: ClientInput,
    @Ctx() { payload }: MyContext,
    ): Promise<Client> {
    const userId = +payload!.userId;
    const userRoleId = payload!.userRoleId;
    const cim = clientInputMapped(clientInput)
    const client = Client.create(cim);
    await client.save();

    if(userRoleId === 3) {
      const message = clientMessage('Agrego', clientInput.cedula || '')
      await addNewReport(userId, message)
    }

    return client;
  }

  @Mutation(() => Client)
  @UseMiddleware(isAuth)
  async updateClient(
    @Arg('data') clientInput: ClientInput,
    @Ctx() { payload }: MyContext,
  ): Promise<Client | undefined> {
    const userId = +payload!.userId;
    const userRoleId = payload!.userRoleId;

    const exists = await Client.findOne(clientInput.clientId);

    if (!exists) {
      throw new UserInputError(errorList.notFound('El cliente'));
    }

    const cim = clientInputMapped(clientInput)

    await Client.update({ clientId: clientInput.clientId }, { ...cim });
    const client = await Client.findOne(clientInput.clientId);

    if(userRoleId === 3) {
      const message = clientMessage('Actualizo', clientInput.cedula || '')
      await addNewReport(userId, message)
    }

    return client;
  }

  @Query(() => Client)
  // @UseMiddleware(isAuth)
  async getClientById(
    @Arg('clientId') clientId: number,
  ): Promise<Client | undefined> {
    const client = await Client.findOne(clientId);
    return client;
  }

  @Query(() => [Client])
  async getAllClients(
    @Arg('hotelId', () => Int) hotelId: number
  ): Promise<Client[]> {
    const client = await Client.find({
      where: { hotel: { hotelId } }
    });
    return client;
  }

  @Query(() => [Client])
  async getAllClientsBySearchCriteria(
    @Arg('criteria', () => String) criteria: string,
    @Arg('hotelId', () => Int) hotelId: number
  ): Promise<Client[]> {
    const client = await Client.find({
      where: [
        {cedula: Like(`%${criteria}%`)},
        {name: Like(`%${criteria}%`)},
        { hotel: { hotelId } }
      ]
    });
    return client;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteClient(
    @Arg('clientId', () => Int) clientId: number,
    @Ctx() { payload }: MyContext,
  ): Promise<boolean> {
    const userId = +payload!.userId;
    const userRoleId = payload!.userRoleId;

    const clientToDelete = await Client.findOne(clientId);
    await clientToDelete?.remove();

    if(userRoleId === 3) {
      const message = clientMessage('Borro', clientToDelete?.cedula || '')
      await addNewReport(userId, message)
    }

    return true;
  }
}
