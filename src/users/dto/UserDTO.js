export class UserDTO {
  id;
  name;
  age;

  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.age = user.age;
  }

  getFullName() {
    return this.name;
  }
}
