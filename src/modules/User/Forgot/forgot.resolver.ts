import { UserInputError } from 'apollo-server-express';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../../entity/User';
import { errorList } from '../../../utils/errorList';

@Resolver()
export class ForgotResolver {

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
  ): Promise<boolean> {

    const user = await User.findOne({
      where: { email }
    });

    if(!user) {
      throw new UserInputError(errorList.notFound('El correo'))
    }

    user.needsNewPassword = true;
    await user.save();
    return true;
  }
}
