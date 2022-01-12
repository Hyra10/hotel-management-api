import {
  Resolver, Mutation, Arg, Ctx,
  Query, UseMiddleware,
} from 'type-graphql';
import { LoginInputType } from './LoginInputType';
import { User } from '../../../entity/User';
import { compare } from 'bcryptjs';
import { LoginResponse } from './LoginResponse';
import { MyContext } from '../../../utils/MyContext';
import {
  createRefreshToken,
  createAccessToken,
} from '../../../utils/createTokens';
import { TOKEN_COOKIE } from '../../../utils/constants';
import { isAuth } from '../../middlewares/isAuth';
import { errorList } from '../../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class LoginResolver {

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId, {
      relations: ['userRole']
    });
    return user;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('data') loginInput: LoginInputType,
    @Ctx() { res }: MyContext,
  ): Promise<LoginResponse> {
    const user = await User.findOne({
      where: { email: loginInput.email },
      relations: ['userRole']
    });

    if (!user) {
      throw new UserInputError(errorList.notFound('El usuario'));
    }

    const valid = await compare(loginInput.password, user.password);

    if (!valid) {
      throw new UserInputError(errorList.wrongCredentials);
    }

    res.cookie(TOKEN_COOKIE, createRefreshToken(user), { httpOnly: true });

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
}
