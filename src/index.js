import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let users = [
  {
    id: 1,
    name: 'jonghwan',
    age: 12,
  },
];

const app = express();

// use는 미들웨어, 라우터에 사용
app.use(cors({ origin: '*' })); // localhost 에서 작동 X
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '700mb' })); // 700 메가바이트
app.use(express.json());

app.get('/users', (req, res) => {
  res.status(200).json({ users });
});

app.post('/users', (req, res) => {
  const { name, age } = req.body;

  users.push({
    id: new Date().getTime(),
    name,
    age,
  });

  res.status(201).json({ users });
});


app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const targetUser = users.findIndex((user) => user.id === Number(id));

  users[targetUser] = {
    ...users[targetUser],
    name: name ?? users[targetUser].name,
    age: age ?? users[targetUser].age,
  };

  res.status(204).json({});
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const deleteUsers = users.filter((user) => user.id === Number(id));
  res.statusCode(204).json({});
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
