import { Router } from 'express';
import { UserService } from '../service/index.js';
import { pagination } from '../../../middleware/pagination.js';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/index.js';

class UserController {
  constructor() {
    this.router = Router();
    this.path = '/users';
    this.userService = new UserService();
    this.init();
  }

  init() {
    this.router.get('/', pagination, this.getUsers);
    this.router.get('/detail/:id', this.getUser);
    this.router.post('/', this.createUser);
    this.router.post('/', this.updateUser);
    this.router.post('/', this.deleteUser);
  }

  getUsers = async (req, res, next) => {
    try {
      // console.log(req.skip, req.take);
      const { users, count } = await this.userService.findUsers({
        skip: req.skip,
        take: req.take,
      });

      // console.log(users, count);

      res.status(200).json({ users, count });
      // res.status(200).json({ users: users.map((user) => new UserDto(user)), count });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findUserById(id);

      res.status(200).json({ user: new UserDto(user) });
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const createUserDto = new CreateUserDto(req.body);
      const newUserId = await this.userService.createUser(createUserDto);
      // 201 created
      res.status(201).json({ id: newUserId });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateUserDto = new UpdateUserDto(req.body);
      await this.userService.updateUser(id, updateUserDto);

      req.status(204).json({});
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();


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
