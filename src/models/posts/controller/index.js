import { Router } from 'express';
import { PostService } from '../service/index.js';
import { CreateChildCommentDto, CreateCommentDto, CreatePostDto, PostLikeDto, UpdatePostDto } from '../dto/index.js';
import { pagination } from '../../../middleware/pagination.js';
import { UpdateCommentDto } from '../dto/comment/index.js';

class PostController {

  constructor() {
    this.router = Router();
    this.path = '/posts';
    this.postService = new PostService();
    this.init();
  }

  init() {
    this.router.post('/', this.createPost.bind(this));
    this.router.post('/comment', this.createComment.bind(this));
    this.router.post('/child-comment', this.createChildComment.bind(this));
    this.router.get('/', pagination, this.getPosts.bind(this));
    this.router.get('/:id', this.getPost.bind(this));
    this.router.get('/post-like/:id', this.createPostLike.bind(this));
    this.router.delete('/post-like/:id', this.deletePostLike.bind(this));
    this.router.post('/post-like', this.postLike.bind(this));
    this.router.patch('/:id', this.updatePost.bind(this));
    this.router.patch('/comments/:id', this.updateComment.bind(this));
    this.router.delete('/:id', this.deletePost.bind(this));
    this.router.delete('/comments/:id', this.deleteComment.bind(this));
  }

  async createPost(req, res, next) {
    try {
      // JWT 미들웨어에서 인증되지 않음
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요.' };

      const newPostId = await this.postService.createPost(
        new CreatePostDto({
          ...req.body,
          userId: req.user.id,
        }),
      );

      res.status(201).json({ id: newPostId });
    } catch (err) {
      next(err);
    }
  }

  async createComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요.' };

      const newCommentId = await this.postService.createComment(
        new CreateCommentDto({
          ...req.body,
          userId: req.user.id,
        }),
      );

      res.status(201).json({ id: newCommentId });
    } catch (err) {
      next(err);
    }
  }

  async createChildComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요.' };

      const newChildCommentId = await this.postService.createChildComment(
        new CreateChildCommentDto({
          ...req.body,
          userId: req.user.id,
        }),
      );

      res.status(201).json({ id: newChildCommentId });
    } catch (err) {
      next(err);
    }
  }

  async getPosts(req, res, next) {
    try {
      const { skip, take } = req;
      const { searchValue } = req.query;
      const { posts, count } = await this.postService.getPosts({ skip, take }, searchValue);

      res.status(200).json({ posts, count });
    } catch (err) {
      next(err);
    }
  }

  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.postService.getPost(id, req.user);
      res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  }

  async createPostLike(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };

      const userId = req.user.id;
      const postId = req.params.id;

      await this.postService.createPostLike(userId, postId);

      res.status(201).json({});
    } catch (err) {
      next(err);
    }
  }

  async deletePostLike(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };

      const userId = req.user.id;
      const postId = req.params.id;

      await this.postService.deletePostLike(userId, postId);

      res.status(201).json({});
    } catch (err) {
      next(err);
    }
  }

  async postLike(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };

      await this.postService.postLike(
        new PostLikeDto({
          ...req.body,
          userId: req.user.id,
        }),
      );

      res.status(201).json({});
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };
      const { id } = req.params;

      await this.postService.updatePost(
        new UpdatePostDto({
          postId: id,
          userId: req.user.id,
          ...req.body,
        }),
      );

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };
      const { id } = req.params;

      await this.postService.updateComment(
        new UpdateCommentDto({
          id,
          userId: req.user.id,
          content: req.body.content,
        }),
      );

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };
      const { id } = req.params;

      await this.postService.deletePost(id, req.user);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      if (!req.user) throw { status: 401, message: '로그인을 진행해주세요' };
      const { id } = req.params;

      await this.postService.deleteComment(id, req.user);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new PostController();
