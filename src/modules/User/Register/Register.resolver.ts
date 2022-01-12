import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { RegisterInputType } from './RegisterInputType';
import { ProfessorStudent } from '../../../entity/ProfessorStudent';
import { errorList } from '../../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class RegisterResolver {

  @Mutation(() => User)
  async registerStudent(
    @Arg('data')registerInput: RegisterInputType,
  ): Promise<User> {

    const allUsers = await User.find({
      select: ['userName', 'email']
    });
    
    const userNameExists = allUsers.some(x => x.userName === registerInput.userName)
    const emailExists = allUsers.some(x => x.email === registerInput.email)

    if(userNameExists) {
      throw new UserInputError(errorList.alreadyExists('El nombre de usuario'));
    } else if (emailExists) {
      throw new UserInputError(errorList.alreadyExists('El email'));
    }

    const todaysDate = new Date();
    const hashedPassword = await bcrypt.hash(registerInput.password, 13);
    registerInput.password = hashedPassword;
    const user = await User.create({
      ...registerInput,
      createdAt: todaysDate,
      updatedAt: todaysDate,
      userRole: {
        userRoleId: 3
      },
    }).save();

    await ProfessorStudent.create({
      profesor: {
        userId: registerInput.profesorId
      },
      student: {
        userId: user.userId
      }
    }).save();

    return user;
  }
}
