import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export class UpdateUserDto {
  constructor(user) {
    // this.age = user.age ?? undefined;
    this.name = user.name ?? undefined;
    this.phoneNumber = user.phoneNumber ?? undefined;
    this.email = user.email ?? undefined;
    this.password = user.password ?? undefined;
    this.description = user.description ?? undefined;
  }

  async updatePassword() {
    this.password = await bcrypt.hash(this.password, process.env.JWT_SECRET);
  }
}
