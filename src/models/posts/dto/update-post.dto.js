export class UpdatePostDto {
  // 이것보다 id, userid는 파라미터로 따로 받는게 좋을 것 같아!!
  constructor(props) {
    this.postId = props.postId;
    this.title = props.title ?? undefined;
    this.content = props.content ?? undefined;
    this.userId = props.userId;
    this.tags = props.tags ?? undefined;
  }
}
