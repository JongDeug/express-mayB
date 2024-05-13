import { CommonRouter } from './common-router.js';
import PostsController from '../controllers/posts.js';

class PostsRouter extends CommonRouter {
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
    this.router.get('/', PostsController.getPosts.bind(this));
  }
}

const postsRouter = new PostsRouter('/posts');
export default postsRouter;
