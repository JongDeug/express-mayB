import { Router } from 'express';
import { PostService } from '../service/index.js';

class PostController {

  constructor() {
    this.router = Router();
    this.path = '/posts';
    this.postService = new PostService();
    this.init();
  }

  init() {
    this.router.post('/', this.createPost.bind(this));
  }

  createPost(req, res, next) {
    try {

    } catch (err) {

    }
  }
}

export default new PostController();
