export class CreateUserDto {
  constructor(user) {
    this.age = user.age;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.password = user.password;
  }
}
