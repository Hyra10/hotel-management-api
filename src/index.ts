import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { createSchema } from './utils/createSchema';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken, createRefreshToken } from './utils/createTokens';
import { TOKEN_COOKIE } from './utils/constants';

const server = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = Express();
  app.disable('x-powered-by');
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies[TOKEN_COOKIE];
    if (!token) {
      console.log('token is not valid ' + token);
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }
    
    const user = await User.findOne(payload.userId, {
      relations: ['userRole']
    });

    if (!user) {
      console.log('User not found');
      return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    res.cookie(TOKEN_COOKIE, createRefreshToken(user), { httpOnly: true });

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, '127.0.0.1', () => {
    console.log('hotel server started on localhost:4000/graphql');
  });
};

server();
