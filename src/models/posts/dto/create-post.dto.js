export class CreatePostDto {
  constructor(props) {
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
    this.tags = props.tags;
  }
}
