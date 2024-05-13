import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import UserRouter from '../router/users.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

// use는 미들웨어, 라우터에 사용
app.use(cors({ origin: '*' })); // localhost 에서 작동 X
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '700mb' })); // 700 메가바이트
app.use(express.json());

app.get('/', (req, res) => {
  res.send('dkdkddk');
});
app.use('/users', UserRouter.router);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
