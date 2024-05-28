import { UserDto } from '../../../users/dto/index.js';

export class CommentDto {
  constructor(props) {
    this.id = props.id;
    this.content = props.content;
    this.user = new UserDto(props.user);
    this.childComments = props.childComments?.map(
      (comment) => new CommentDto(comment)
    );
  }
}
