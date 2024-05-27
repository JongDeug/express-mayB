import bcrypt from 'bcrypt';

export class LoginDto {
  constructor(props) {
    this.email = props.email;
    this.password = props.password;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}
