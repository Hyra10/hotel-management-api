import { Resolver, Mutation, Arg, Int, Ctx } from 'type-graphql';
import { getConnection } from 'typeorm';
import { User } from '../../../entity/User';
import { MyContext } from '../../../utils/MyContext';
import { TOKEN_COOKIE } from '../../../utils/constants';

@Resolver()
export class UserUtilityResolver {
  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ userId }, 'tokenVersion', 1);

    return true;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    res.cookie(TOKEN_COOKIE, '', { httpOnly: true });
    return true;
  }
}
