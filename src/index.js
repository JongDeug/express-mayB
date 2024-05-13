import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RoutersManager from './routers/index.js';

const app = express();

// use는 미들웨어, 라우터에 사용
app.use(cors({ origin: '*' })); // localhost 에서 작동 X
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '700mb' })); // 700 메가바이트
app.use(express.json());

// router 등록
RoutersManager.forEach(manager => {
  app.use(manager.path, manager.router);
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
