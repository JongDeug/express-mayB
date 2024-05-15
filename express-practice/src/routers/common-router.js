import { Router } from 'express';

export class CommonRouter {
  constructor(path) {
    this.path = path;
    this.router = Router();
  }
}
