import { Router } from 'express';

class UserController {
  constructor(path) {
    this.router = Router();
    this.path = path;
    this.init();
  }

  init() {
    this.router.get('/', this.getUsers);
  }

  getUsers() {

  }
}

export default new UserController('/users');



// import { UserDTO, CreateUserDTO } from '../dto/index.js';

//
// function getUsers(req, res, next) {
//   try {
//     const users = this.users.map(user => new UserDTO(user))
//     // console.log(users[0].getFullName()) => 객체가 된다!
//     res.status(200).json({ users });
//     // throw new Error('test');
//   } catch (err) {
//     next(err);
//   }
// }
//
// // 이건 안되더라
// // export const getUsers = (req, res) => {
// //   res.status(200).json({ users: this.users });
// // };
//
// function getUser(req, res, next) {
//   try {
//     const { id } = req.params;
//
//     const user = this.users.find((user) => user.id === +id);
//
//     if (!user) {
//       const error = new Error('유저를 찾을 수 없습니다.');
//       error.status = 404;
//       throw error;
//     }
//
//     res.status(200).json({ user });
//   } catch (err) {
//     next(err);
//   }
// }
//
// function createUser(req, res, next) {
//   try {
//     const { name, age } = req.body;
//
//     if (!name) {
//       throw { status: 400, message: '이름이 없습니다.' };
//     }
//
//     const user = new CreateUserDTO(name, age).getNewUser();
//
//     this.users.push(user);
//
//     res.status(201).json({ users: this.users });
//   } catch (err) {
//     next(err);
//   }
// }
//
// export default {
//   getUsers,
//   getUser,
//   createUser
// };
