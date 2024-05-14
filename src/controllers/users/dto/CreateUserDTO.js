export class CreateUserDTO {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getNewUser() {
    return {
      id: new Date().getTime(),
      name: this.name,
      age: this.age,
    };
  }
}
