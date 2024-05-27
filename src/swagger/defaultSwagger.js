const defaultSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'Swagger 연습',
    description: '설명 들어가는 곳',
    version: '5.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default defaultSwagger;
