import { Router } from 'express';
import UserController from '../controllers/users.js';
import { CommonRouter } from './common-router.js';

// import { getUsers } from '../controllers/users.js';

class UserRouter extends CommonRouter{
  constructor(path) {
    super(path)
    this.users = [
      {
        id: 1,
        name: 'jongdeug',
        age: 12,
      },
    ];
    this.init();
  }

  init() {
    this.router.get('/', UserController.getUsers.bind(this));
    // this.router.get('/', getUsers); // 이건 안됨 => 여기서 렉시컬 환경의 상위는 전역이더라
    // this.routers.get('/', this.getUsers.bind(this)); // 이건 함수를 실행해서 넘긴게 아니고, 콜백으로 함수만 넘겼으니까 지정해줘야한다.
  }

  // // bind 예시
  // // getUsers(req, res) {
  // //   res.status(200).json({ users: this.users });
  // // }
  //
  // getUsers = (req, res) => {
  //   res.status(200).json({ users: this.users });
  // };
}

const userRouter = new UserRouter('/users');
export default userRouter;

// const routers = Router();
//
// let users = [
//   {
//     id: 1,
//     name: 'jonghwan',
//     age: 12,
//   },
// ];
//
// routers.get('/', (req, res) => {
//   res.status(200).json({ users });
// });
//
// routers.get('/detail/:id', (req, res) => {
//   const { id } = req.params;
//
//   const user = users.find((user) => user.id === Number(id));
//
//   res.status(200).json({ user });
// });
//
// routers.post('/login', (req, res) => {
//   const { name, age } = req.body;
//   users.push({
//     id: new Date().getTime(),
//     name,
//     age,
//   });
//   res.status(201).json({ users });
// });
//
// export default routers;
