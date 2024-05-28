import { UserDto } from '../../users/dto/index.js';

export class PostsDto {
  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.user = new UserDto(props.user);
  }
}
