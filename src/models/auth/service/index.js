import { UserService } from '../../users/service/index.js';
import { CreateUserDto } from '../../users/dto/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  // props: RegisterDTO
  async register(props) {
    const isExist = await this.userService.checkUserByEmail(props.email);

    if (isExist) throw { status: 400, message: '이미 존재하는 이메일 입니다.' };

    const newUserId = await this.userService.createUser(
      new CreateUserDto({
        ...props,
        password: await props.hashPassword(),
      }),
    );

    const accessToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    const refreshToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });
    console.log({ accessToken, refreshToken });

    return { accessToken, refreshToken };
  }

  // props: LoginDto
  async login(props) {
    // 유저 있는지 체크
    const user = await this.userService.checkUserByEmail(props.email);

    if (!user) throw { status: 404, message: '가입된 유자가 아닙니다.' };

    // 비밀번호 체크
    const isCorrect = await props.comparePassword(user.password);

    if (isCorrect) throw { status: 400, message: '비밀번호를 잘못 입력하였습니다.' };

    // jwt
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: '2h',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
