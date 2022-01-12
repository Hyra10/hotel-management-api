import bcrypt from 'bcryptjs';
import { Resolver, Query, Mutation, Arg, Int, UseMiddleware, Ctx } from 'type-graphql';
import { ProfessorStudent } from '../../entity/ProfessorStudent';
import { MyContext } from '../../utils/MyContext';
import { User } from '../../entity/User';
import { isAuth } from '../middlewares/isAuth';
import { UserInput } from './UserInput.Type';
import { errorList } from '../../utils/errorList';
import { UserInputError } from 'apollo-server-express';

const mapRawQueryToUsers = (rawQuery: any): User[] => {
  const users = rawQuery.map((x: any) => {
    const u = new User()
    u.userId = x.UserId;
    u.userName = x.UserName;
    u.email = x.Email;
    u.needsNewPassword = x.needsNewPassword;
    return u
  });

  return users;
}

@Resolver()
export class UserResolver {

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAllUsers(
    @Ctx() { payload }: MyContext,
  ): Promise<User[]> {
    const userId = payload!.userId;
    const userRoleId = payload!.userRoleId;

    let users: User[] = [];
    if(userRoleId === 2) {
      const rawQuery = await User.query(`
        SELECT "u".* FROM "User" AS "u"
        INNER JOIN "ProfessorStudent" AS "ps" ON "ps"."StudentId" = "u"."UserId"
        WHERE "ps"."ProfesorId" = ${userId}`
      ) || [];

      users = mapRawQueryToUsers(rawQuery);
    } else {
      users = await User.find({
        where: {
          userRole: {
            userRoleId: 2
          }
        }
      })
    }

    return users;
  }

  @Query(() => [User])
  async getAllProfesors(
  ): Promise<User[]> {
    const users = User.find({
      where: {
        userRole: {
          userRoleId: 2
        }
      }
    })

    return users;
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async addUser(
    @Arg('data') {userRoleId, ...userInput}: UserInput,
    @Ctx() { payload }: MyContext,
  ): Promise<User> {
    const date = new Date();
    const userId = payload!.userId;
    const hashedPassword = await bcrypt.hash('123', 13);

    const user = User.create({
      createdAt: date,
      updatedAt: date,
      password: hashedPassword,
      userRole: {
        userRoleId
      },
      ...userInput
    });

    await user.save();

    const profesor = await User.findOne(userId, {
      relations: ['userRole']
    });

    if(profesor && profesor?.userRole?.userRoleId === 2) {
      const newPs = ProfessorStudent.create({
        profesor: {
          userId: profesor.userId
        },
        student: {
          userId: user.userId
        }
      });
      await newPs.save();
    }

    return user;
  }

  @Mutation(() => User)
  // @UseMiddleware(isAuth)
  async updateUser(
    @Arg('data') {userRoleId, ...userInput}: UserInput
  ): Promise<User | undefined> {
    console.log(userRoleId)
    const exists = await User.findOne(userInput.userId);
    
    if (!exists) {
      throw new UserInputError(errorList.notFound('El usuario'));
    }

    await User.update({ userId: userInput.userId }, { ...userInput });
    const user = await User.findOne(
      userInput.userId);

    return user;
  }

  @Query(() => User)
  // @UseMiddleware(isAuth)
  async getUserById(@Arg('userId', () => Int) userId: number,
  ): Promise<User | undefined> {
    const user = await User.findOne(userId);
    return user;
  }

  @Mutation(() => User)
  // @UseMiddleware(isAuth)
  async deleteUser(
    @Arg('userId', () => Int) userId: number,
  ): Promise<User | undefined> {
    const userToDelete = await User.findOne(userId);
    await userToDelete?.remove();

    return userToDelete;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg('password', () => String) password: string,
    @Ctx() { payload }: MyContext,
    ): Promise<boolean> {
    const userId = +payload!.userId;
    const user = await User.findOne(userId);
    const hashedPassword = await bcrypt.hash(password, 13);
    
    if(!user) {
      throw new UserInputError(errorList.notFound('El usuario'))
    }

    user.password = hashedPassword;
    await user?.save();
    return true;
  }

  @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  async resetPassword(
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { userId }});
    const hashedPassword = await bcrypt.hash('123', 13);

    if(!user) {
      throw new UserInputError(errorList.notFound('El usuario'));
    }

    user.password = hashedPassword;
    user.needsNewPassword = false;
    await user?.save();

    return true;
  }
  
}
