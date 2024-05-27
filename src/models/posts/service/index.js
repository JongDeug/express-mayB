import database from '../../../database.js';
import { UserService } from '../../users/service/index.js';

export class PostService {
  constructor() {
    this.userService = new UserService();
  }

  // props : CreateDto
  async createPost(props) {
    // I. 유저가 실제로 있는 유저인지 확인
    const user = await this.userService.findUserById(props.userId);

    const newPost = await database.post.create({
      data: {
        title: props.title,
        content: props.content,
        user: {
          connect: {
            id: user.id,
          },
        },
        // 오호,,,
        tags: {
          createMany: {
            data: props.tags.map(tag => ({ name: tag })),
          },
        },
      },
    });

    return newPost.id;
  }

}
