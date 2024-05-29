export class UpdateCommentDto {
  // 이것도 update post랑 마찬가지임
  constructor(props) {
    this.id = props.id;
    this.userId= props.userId;
    this.content = props.content ?? undefined;
  }
}
