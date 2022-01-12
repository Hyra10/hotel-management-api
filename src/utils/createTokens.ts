import { User } from '../entity/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = ({ userId, userRole }: User) => {
  return sign(
    { userId, userRoleId: userRole?.userRoleId, },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' },
  );
};

export const createRefreshToken = ({ userId, userRole, tokenVersion }: User) => {

  return sign(
    { userId, userRoleId: userRole?.userRoleId, tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' },
  );
};
