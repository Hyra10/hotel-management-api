import { MiddlewareFn } from 'type-graphql';
import { MyContext } from 'src/utils/MyContext';
import { verify } from 'jsonwebtoken';
import { errorList } from '../../utils/errorList';
import { AuthenticationError } from 'apollo-server-express';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new AuthenticationError(errorList.notAuthenticated);
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.error(err);
    throw new AuthenticationError(errorList.notAuthenticated);
  }
  return next();
};
