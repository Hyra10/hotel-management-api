import { Resolver, Query} from 'type-graphql';
import { UserRole } from '../../entity/UserRole';

@Resolver()
export class UserRoleResolver {

  @Query(() => [UserRole])
  async getAllUserRoles(): Promise<UserRole[]> {
    const userRoles = await UserRole.find();
    return userRoles;
  }
  
}
