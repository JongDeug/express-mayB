import { UserDto } from '../../users/dto/index.js';
import { TagDto } from './tag/index.js';
import { CommentDto } from './comment/index.js';

export class PostDto {
  constructor(props, user) {
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.user = new UserDto(props.user);
    this.comments = props.comments.map(comment => new CommentDto({
      id: comment.id,
      content: comment.content,
      childComments: comment.childComments,
      user: comment.user,
    }));
    this.tags = props.tags.map(tag => new TagDto({ id: tag.id, name: tag.name }));
    this.likeCount = props.postLikes.length;
    this.isLiked = user ? !!props.postLikes.find(like => like.userId === user.id) : false;
  }
}
