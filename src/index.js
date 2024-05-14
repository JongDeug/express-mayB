import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RoutersManager from './routers/index.js';
import { swaggerDocs, options } from './swagger/index.js';
import swaggerUi from 'swagger-ui-express';


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

// swagger 등록
app.get('/swagger.json', (req, res) => {
  res.status(200).json(swaggerDocs);
});
// 원래 undefined에 json 파일이 드가야되는데 우리는 js 파일로 작성함
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, options));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || '서버에서 에러가 발생하였습니다.' });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
