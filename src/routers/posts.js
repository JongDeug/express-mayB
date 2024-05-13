import { CommonRouter } from './common-router.js';
import PostController from '../controllers/posts.js';

class PostRouter extends CommonRouter {
  constructor(path) {
    super(path);
    this.posts = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
      },
    ];
    this.init();
  }

  init() {
    this.router.get('/', PostController.getPosts.bind(this));
  }
}

const postRouter = new PostRouter('/posts');
export default postRouter;
