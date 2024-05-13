import { Router } from 'express';

class UserController {
  constructor() {
    this.router = Router();
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
    this.router.get('/', this.getUsers);
    // this.router.get('/', this.getUsers.bind(this)); // 이건 함수를 실행해서 넘긴게 아니고, 콜백으로 함수만 넘겼으니까 지정해줘야한다.
  }

  // bind 예시
  // getUsers(req, res) {
  //   res.status(200).json({ users: this.users });
  // }

  getUsers = (req, res) => {
    res.status(200).json({ users: this.users });
  };
}

const userController = new UserController();
export default userController;

// const router = Router();
//
// let users = [
//   {
//     id: 1,
//     name: 'jonghwan',
//     age: 12,
//   },
// ];
//
// router.get('/', (req, res) => {
//   res.status(200).json({ users });
// });
//
// router.get('/detail/:id', (req, res) => {
//   const { id } = req.params;
//
//   const user = users.find((user) => user.id === Number(id));
//
//   res.status(200).json({ user });
// });
//
// router.post('/login', (req, res) => {
//   const { name, age } = req.body;
//   users.push({
//     id: new Date().getTime(),
//     name,
//     age,
//   });
//   res.status(201).json({ users });
// });
//
// export default router;
