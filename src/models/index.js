import { AuthController, AuthSwagger } from './auth/index.js';
import { UserController, UserSwagger } from './users/index.js';

export const RouterManager = [
  AuthController, UserController,
];

export const Swaggers = {
  UserSwagger,
  AuthSwagger,
};
