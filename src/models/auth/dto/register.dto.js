import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// 보통 dto는 interface로 만들고 별 다른 기능은 하지
// 않는 다는 것만 알아둬
// 나도 여기에 동의함, 수업이라 일단 만들기
export class RegisterDto {
  constructor(props) {
    this.name = props.name;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    // this.age = props.age;
    this.password = props.password;
    this.description = props.description;
  }

  async hashPassword() {
    return await bcrypt.hash(
      this.password,
      Number(process.env.PASSWORD_SALT),
    );
  }
}
