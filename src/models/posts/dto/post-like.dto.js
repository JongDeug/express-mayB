export class PostLikeDto {
  constructor(props) {
    this.userId = props.userId;
    this.postId = props.postId;
    this.tryToLike = props.tryToLike;
  }
}
