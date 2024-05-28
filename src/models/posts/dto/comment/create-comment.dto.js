export class CreateCommentDto {
  constructor(props) {
    this.content = props.content;
    this.postId = props.postId;
    this.userId = props.userId;
  }
}
