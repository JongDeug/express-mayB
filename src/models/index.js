import { AuthController, AuthSwagger } from './auth/index.js';
import { UserController, UserSwagger } from './users/index.js';
import { PostController, PostSwagger } from './posts/index.js';

export const RouterManager = [
  AuthController, UserController, PostController,
];

export const Swaggers = {
  UserSwagger,
  AuthSwagger,
  PostSwagger
};
