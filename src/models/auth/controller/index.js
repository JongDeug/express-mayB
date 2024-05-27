import { AuthService } from '../service/index.js';
import express from 'express';
import { RegisterDto, LoginDto } from '../dto/index.js';

export class AuthController {
  constructor() {
    this.router = express.Router();
    this.path = '/auth';
    this.authService = new AuthService();
    this.init();
  }

  init() {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/refresh', this.refresh.bind(this));
  }

  async register(req, res, next) {
    try {
      const { accessToken, refreshToken } = await this.authService.register(
        new RegisterDto(req.body),
      );

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        new LoginDto(req.body),
      );

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { accessToken, refreshToken } = await this.authService.refresh(req.body.accessToken, req.body.refreshToken);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
}


export default new AuthController();
