import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import database from '../database.js';

dotenv.config();

export const jwtAuth = async (req, res, next) => {
  try {
    // I. 일단 테스트
    const authorization = req.headers['Authorization'] || req.headers['authorization'];
    // 때에 따라서 없을 수도 있다.
    // Bearer ${token} or undefined

    if (
      authorization?.includes('Bearer ') ||
      authorization?.includes('bearer')
    ) {
      if (typeof authorization === 'string') {
        const bearers = authorization.split(' ');
        // bearers: ['Bearer', 'token...']
        if (bearers.length > 1 && typeof bearers[1] === 'string') {
          const accessToken = bearers[1];

          const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_KEY,
          );

          const user = await database.user.findUnique({
            where: {
              id: decodedToken.id,
            },
          });

          // 유저를 찾음
          if (user) {
            req.user = user;
          } else {
            next({ status: 404, message: '유저를 찾을 수 없습니다.' });
          }

          next();
        } else {
          // next안에 뭔가 넘기면 에러가 되는거임
          next({ status: 400, message: 'Token이 잘못되었습니다.' });
        }
      } else {
        // next안에 뭔가 넘기면 에러가 되는거임
        next({ status: 400, message: 'Token이 잘못되었습니다.' });
      }
    } else {
      // next안에 뭔가 넘기면 에러가 되는거임
      next({ status: 400, message: 'Token이 잘못되었습니다.' });
    }

  } catch (err) {
    // 왜 403?
    // Forbidden
    // 클라이언트가 요청한 리소스에 접근할
    // 권한이 없음을 나타낸다.
    next({ ...err, status: 403 });
  }
};
