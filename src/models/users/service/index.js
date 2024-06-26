import database from '../../../database.js';

export class UserService {

  async checkUserByEmail(email) {
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return false;
    return user;
  }

  async findUserById(id) {
    const user = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw { status: 404, message: '유저를 찾을 수 없습니다.' };
    return user;
  }

  async findUsers({ skip, take }) {
    const users = await database.user.findMany({
      skip,
      take,
    });
    // if(!users.length) throw {status:404}

    const count = await database.user.count();

    return {
      users,
      count,
    };
  }

  async createUser(props) {
    const newUser = await database.user.create({
      data: {
        name: props.name,
        email: props.email,
        phoneNumber: props.phoneNumber,
        password: props.password,
        description: props.description,
      },
    });

    return newUser.id;
  }

  async updateUser(id, props) {
    // prisma가 아닌 서버에서 에러를 관리할 수 있도록 해야함.
    const isExist = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) throw { status: 404, message: '유저를 찾을 수 없습니다.' };

    // password가 있다면 bcrypt로 변환함
    if (props.password) {
      await props.updatePassword();
    }

    await database.user.update({
      where: {
        id,
      },
      // prisma에서 undefined이면 업데이트를 수행하지 않음
      data: {
        name: props.name,
        email: props.email,
        // age: props.age,
        phoneNumber: props.phoneNumber,
        password: props.password,
        description: props.description,
      },
    });
  }

  async deleteUser(id) {
    // prisma가 아닌 서버에서 에러를 관리할 수 있도록 해야함.
    const isExist = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) throw { status: 404, message: '유저를 찾을 수 없습니다.' };

    // 204 status
    await database.user.delete({
      where: {
        id,
      },
    });
  }
}
