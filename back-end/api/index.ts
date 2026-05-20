import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // 生成 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('个人笔记管理系统 API')
    .setDescription('个人笔记管理系统的后端接口文档')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 获取 Express 实例，用于手动注册路由
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance();

  // 提供 swagger.json 供 CDN Swagger UI 加载
  expressApp.get('/api-docs/swagger.json', (_req: any, res: any) => {
    res.json(document);
  });

  // 使用 CDN 方式加载 Swagger UI，避免 Vercel serverless 静态资源路径问题
  const swaggerHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>API 文档 - 个人笔记管理系统</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>body{margin:0;background:#fafafa}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: '/api-docs/swagger.json', dom_id: '#swagger-ui' });
  </script>
</body>
</html>`;

  expressApp.get('/api-docs', (_req: any, res: any) => {
    res.type('text/html').send(swaggerHtml);
  });

  expressApp.get('/api-docs/', (_req: any, res: any) => {
    res.type('text/html').send(swaggerHtml);
  });

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  cachedApp(req, res);
}
